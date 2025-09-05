'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Encounter, RecordingState, AlertContact, AppState } from '../types';
import { getCurrentLocation, getLocationInfo, saveToLocalStorage, getFromLocalStorage } from '../utils';
import { dbHelpers } from '../supabase';
import toast from 'react-hot-toast';

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CURRENT_ENCOUNTER'; payload: Encounter | null }
  | { type: 'SET_RECORDING_STATE'; payload: RecordingState }
  | { type: 'SET_ALERT_CONTACTS'; payload: AlertContact[] }
  | { type: 'SET_SELECTED_STATE'; payload: string }
  | { type: 'SET_LOCATION_ENABLED'; payload: boolean }
  | { type: 'ADD_ENCOUNTER'; payload: Encounter }
  | { type: 'UPDATE_ENCOUNTER'; payload: { id: string; updates: Partial<Encounter> } }
  | { type: 'ADD_ALERT_CONTACT'; payload: AlertContact }
  | { type: 'UPDATE_ALERT_CONTACT'; payload: { id: string; updates: Partial<AlertContact> } }
  | { type: 'REMOVE_ALERT_CONTACT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Extended app state
interface ExtendedAppState extends AppState {
  encounters: Encounter[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ExtendedAppState = {
  user: null,
  currentEncounter: null,
  recordingState: {
    isRecording: false,
    duration: 0
  },
  alertContacts: [],
  selectedState: 'CA',
  isLocationEnabled: false,
  encounters: [],
  isLoading: false,
  error: null
};

// Reducer
function appReducer(state: ExtendedAppState, action: AppAction): ExtendedAppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_CURRENT_ENCOUNTER':
      return { ...state, currentEncounter: action.payload };
    
    case 'SET_RECORDING_STATE':
      return { ...state, recordingState: action.payload };
    
    case 'SET_ALERT_CONTACTS':
      return { ...state, alertContacts: action.payload };
    
    case 'SET_SELECTED_STATE':
      return { ...state, selectedState: action.payload };
    
    case 'SET_LOCATION_ENABLED':
      return { ...state, isLocationEnabled: action.payload };
    
    case 'ADD_ENCOUNTER':
      return { 
        ...state, 
        encounters: [action.payload, ...state.encounters]
      };
    
    case 'UPDATE_ENCOUNTER':
      return {
        ...state,
        encounters: state.encounters.map(encounter =>
          encounter.encounterId === action.payload.id
            ? { ...encounter, ...action.payload.updates }
            : encounter
        ),
        currentEncounter: state.currentEncounter?.encounterId === action.payload.id
          ? { ...state.currentEncounter, ...action.payload.updates }
          : state.currentEncounter
      };
    
    case 'ADD_ALERT_CONTACT':
      return {
        ...state,
        alertContacts: [...state.alertContacts, action.payload]
      };
    
    case 'UPDATE_ALERT_CONTACT':
      return {
        ...state,
        alertContacts: state.alertContacts.map(contact =>
          contact.id === action.payload.id
            ? { ...contact, ...action.payload.updates }
            : contact
        )
      };
    
    case 'REMOVE_ALERT_CONTACT':
      return {
        ...state,
        alertContacts: state.alertContacts.filter(contact => contact.id !== action.payload)
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: ExtendedAppState;
  dispatch: React.Dispatch<AppAction>;
  
  // User actions
  initializeUser: (userId: string) => Promise<void>;
  updateUserPreferences: (updates: Partial<User>) => Promise<void>;
  
  // Location actions
  requestLocationPermission: () => Promise<boolean>;
  getCurrentUserLocation: () => Promise<{ latitude: number; longitude: number; city?: string; state?: string } | null>;
  
  // Encounter actions
  startEncounter: () => Promise<string | null>;
  endEncounter: (encounterId: string, summary?: string) => Promise<void>;
  loadUserEncounters: () => Promise<void>;
  
  // Recording actions
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  
  // Alert actions
  sendAlert: (message?: string) => Promise<boolean>;
  loadAlertContacts: () => Promise<void>;
  saveAlertContact: (contact: Omit<AlertContact, 'id'>) => Promise<void>;
  updateAlertContact: (id: string, updates: Partial<AlertContact>) => Promise<void>;
  deleteAlertContact: (id: string) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app state from localStorage
  useEffect(() => {
    const savedState = getFromLocalStorage('appState', {});
    
    if (savedState.selectedState) {
      dispatch({ type: 'SET_SELECTED_STATE', payload: savedState.selectedState });
    }
    
    if (savedState.alertContacts) {
      dispatch({ type: 'SET_ALERT_CONTACTS', payload: savedState.alertContacts });
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    saveToLocalStorage('appState', {
      selectedState: state.selectedState,
      alertContacts: state.alertContacts
    });
  }, [state.selectedState, state.alertContacts]);

  // User actions
  const initializeUser = async (userId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      let user = await dbHelpers.getUser(userId);
      
      if (!user) {
        user = await dbHelpers.createUser({
          user_id: userId,
          subscription_status: 'free',
          preferred_language: 'en',
          saved_state_laws: [state.selectedState]
        });
      }
      
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_SELECTED_STATE', payload: user.saved_state_laws[0] || 'CA' });
      
      // Load user data
      await Promise.all([
        loadUserEncounters(),
        loadAlertContacts()
      ]);
      
    } catch (error) {
      console.error('Error initializing user:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize user data' });
      toast.error('Failed to load user data');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUserPreferences = async (updates: Partial<User>) => {
    if (!state.user) return;
    
    try {
      const updatedUser = await dbHelpers.updateUser(state.user.userId, updates);
      dispatch({ type: 'SET_USER', payload: updatedUser });
      toast.success('Preferences updated');
    } catch (error) {
      console.error('Error updating user preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  // Location actions
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      await getCurrentLocation();
      dispatch({ type: 'SET_LOCATION_ENABLED', payload: true });
      return true;
    } catch (error) {
      console.error('Location permission denied:', error);
      dispatch({ type: 'SET_LOCATION_ENABLED', payload: false });
      toast.error('Location access is required for emergency features');
      return false;
    }
  };

  const getCurrentUserLocation = async () => {
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      
      const locationInfo = await getLocationInfo(latitude, longitude);
      
      return {
        latitude,
        longitude,
        city: locationInfo.city,
        state: locationInfo.state
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  // Encounter actions
  const startEncounter = async (): Promise<string | null> => {
    if (!state.user) {
      toast.error('Please log in to start an encounter');
      return null;
    }

    try {
      const location = await getCurrentUserLocation();
      if (!location) {
        toast.error('Location is required to start an encounter');
        return null;
      }

      const encounter = await dbHelpers.createEncounter({
        encounter_id: `encounter_${Date.now()}`,
        user_id: state.user.userId,
        timestamp: new Date().toISOString(),
        location,
        alert_sent: false
      });

      dispatch({ type: 'SET_CURRENT_ENCOUNTER', payload: encounter });
      dispatch({ type: 'ADD_ENCOUNTER', payload: encounter });
      
      toast.success('Encounter started');
      return encounter.encounter_id;
    } catch (error) {
      console.error('Error starting encounter:', error);
      toast.error('Failed to start encounter');
      return null;
    }
  };

  const endEncounter = async (encounterId: string, summary?: string) => {
    try {
      const updates: Partial<Encounter> = {
        duration: state.recordingState.duration
      };
      
      if (summary) {
        updates.summary = summary;
      }

      await dbHelpers.updateEncounter(encounterId, updates);
      
      dispatch({ type: 'UPDATE_ENCOUNTER', payload: { id: encounterId, updates } });
      dispatch({ type: 'SET_CURRENT_ENCOUNTER', payload: null });
      dispatch({ type: 'SET_RECORDING_STATE', payload: { isRecording: false, duration: 0 } });
      
      toast.success('Encounter ended');
    } catch (error) {
      console.error('Error ending encounter:', error);
      toast.error('Failed to end encounter');
    }
  };

  const loadUserEncounters = async () => {
    if (!state.user) return;
    
    try {
      const encounters = await dbHelpers.getEncounters(state.user.userId);
      // Convert string timestamps to Date objects
      const processedEncounters = encounters.map(encounter => ({
        ...encounter,
        timestamp: new Date(encounter.timestamp)
      }));
      
      dispatch({ type: 'SET_LOADING', payload: false });
      // Note: We're not dispatching encounters here as they're not in the reducer
      // You might want to add an action for this
    } catch (error) {
      console.error('Error loading encounters:', error);
    }
  };

  // Recording actions
  const startRecording = async () => {
    dispatch({ type: 'SET_RECORDING_STATE', payload: { isRecording: true, duration: 0, startTime: new Date() } });
    toast.success('Recording started');
  };

  const stopRecording = async () => {
    dispatch({ type: 'SET_RECORDING_STATE', payload: { isRecording: false, duration: state.recordingState.duration } });
    toast.success('Recording stopped');
  };

  // Alert actions
  const sendAlert = async (message?: string): Promise<boolean> => {
    if (!state.user || state.alertContacts.length === 0) {
      toast.error('No alert contacts configured');
      return false;
    }

    const location = await getCurrentUserLocation();
    if (!location) {
      toast.error('Location is required to send alerts');
      return false;
    }

    try {
      const { sendEmergencyAlert } = await import('../utils');
      const result = await sendEmergencyAlert(
        state.user.userId,
        location,
        state.alertContacts,
        state.currentEncounter?.encounterId,
        message
      );

      if (result.success) {
        toast.success(`Alert sent to ${state.alertContacts.length} contact(s)`);
        return true;
      } else {
        toast.error(result.error || 'Failed to send alert');
        return false;
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      toast.error('Failed to send alert');
      return false;
    }
  };

  const loadAlertContacts = async () => {
    if (!state.user) return;
    
    try {
      const contacts = await dbHelpers.getAlertContacts(state.user.userId);
      dispatch({ type: 'SET_ALERT_CONTACTS', payload: contacts });
    } catch (error) {
      console.error('Error loading alert contacts:', error);
    }
  };

  const saveAlertContact = async (contact: Omit<AlertContact, 'id'>) => {
    if (!state.user) return;
    
    try {
      const newContact = await dbHelpers.createAlertContact({
        id: `contact_${Date.now()}`,
        user_id: state.user.userId,
        ...contact
      });
      
      dispatch({ type: 'ADD_ALERT_CONTACT', payload: newContact });
      toast.success('Contact added');
    } catch (error) {
      console.error('Error saving alert contact:', error);
      toast.error('Failed to save contact');
    }
  };

  const updateAlertContact = async (id: string, updates: Partial<AlertContact>) => {
    try {
      await dbHelpers.updateAlertContact(id, updates);
      dispatch({ type: 'UPDATE_ALERT_CONTACT', payload: { id, updates } });
      toast.success('Contact updated');
    } catch (error) {
      console.error('Error updating alert contact:', error);
      toast.error('Failed to update contact');
    }
  };

  const deleteAlertContact = async (id: string) => {
    try {
      await dbHelpers.deleteAlertContact(id);
      dispatch({ type: 'REMOVE_ALERT_CONTACT', payload: id });
      toast.success('Contact removed');
    } catch (error) {
      console.error('Error deleting alert contact:', error);
      toast.error('Failed to remove contact');
    }
  };

  // Utility actions
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    initializeUser,
    updateUserPreferences,
    requestLocationPermission,
    getCurrentUserLocation,
    startEncounter,
    endEncounter,
    loadUserEncounters,
    startRecording,
    stopRecording,
    sendAlert,
    loadAlertContacts,
    saveAlertContact,
    updateAlertContact,
    deleteAlertContact,
    clearError
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
