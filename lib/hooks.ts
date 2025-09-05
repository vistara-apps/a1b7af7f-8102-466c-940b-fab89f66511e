import { useState, useEffect, useCallback } from 'react';
import { User, Encounter, LegalGuide, AlertContact } from './types';
import { apiRequest, storage, getCurrentLocation } from './utils';
import { toast } from 'react-hot-toast';

// User authentication and management hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (walletAddress: string, preferredLanguage: 'en' | 'es' = 'en') => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ walletAddress, preferredLanguage }),
      });
      
      const userData = response.user;
      setUser(userData);
      storage.set('user', userData);
      toast.success('Successfully logged in!');
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const response = await apiRequest('/api/auth', {
        method: 'PUT',
        body: JSON.stringify({ userId: user.userId, updates }),
      });
      
      const updatedUser = response.user;
      setUser(updatedUser);
      storage.set('user', updatedUser);
      toast.success('Profile updated successfully!');
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    storage.remove('user');
    toast.success('Logged out successfully');
  }, []);

  useEffect(() => {
    const savedUser = storage.get('user');
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    login,
    updateUser,
    logout,
    isAuthenticated: !!user,
    isPremium: user?.subscriptionStatus === 'premium'
  };
}

// Legal guides management hook
export function useLegalGuides(state?: string, language: 'en' | 'es' = 'en') {
  const [guides, setGuides] = useState<LegalGuide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({ language });
      if (state) params.append('state', state);
      
      const response = await apiRequest(`/api/legal-guides?${params}`);
      setGuides(response.guides);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch guides';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [state, language]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  return {
    guides,
    loading,
    error,
    refetch: fetchGuides
  };
}

// Encounters management hook
export function useEncounters(userId?: string) {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEncounters = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest(`/api/encounters?userId=${userId}`);
      setEncounters(response.encounters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch encounters';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createEncounter = useCallback(async (location: { latitude: number; longitude: number; city?: string; state?: string }) => {
    if (!userId) throw new Error('User ID required');

    try {
      const response = await apiRequest('/api/encounters', {
        method: 'POST',
        body: JSON.stringify({ userId, location }),
      });
      
      const newEncounter = response.encounter;
      setEncounters(prev => [newEncounter, ...prev]);
      toast.success('Encounter recorded');
      return newEncounter;
    } catch (error) {
      console.error('Create encounter error:', error);
      toast.error('Failed to record encounter');
      throw error;
    }
  }, [userId]);

  const updateEncounter = useCallback(async (encounterId: string, updates: Partial<Encounter>) => {
    try {
      const response = await apiRequest('/api/encounters', {
        method: 'PUT',
        body: JSON.stringify({ encounterId, updates }),
      });
      
      const updatedEncounter = response.encounter;
      setEncounters(prev => prev.map(enc => 
        enc.encounterId === encounterId ? updatedEncounter : enc
      ));
      return updatedEncounter;
    } catch (error) {
      console.error('Update encounter error:', error);
      toast.error('Failed to update encounter');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchEncounters();
  }, [fetchEncounters]);

  return {
    encounters,
    loading,
    error,
    createEncounter,
    updateEncounter,
    refetch: fetchEncounters
  };
}

// Alert contacts management hook
export function useAlertContacts(userId?: string) {
  const [contacts, setContacts] = useState<AlertContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest(`/api/alert-contacts?userId=${userId}`);
      setContacts(response.contacts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch contacts';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addContact = useCallback(async (contact: Omit<AlertContact, 'id'>) => {
    if (!userId) throw new Error('User ID required');

    try {
      const response = await apiRequest('/api/alert-contacts', {
        method: 'POST',
        body: JSON.stringify({ userId, ...contact }),
      });
      
      const newContact = response.contact;
      setContacts(prev => [...prev, newContact]);
      toast.success('Contact added successfully');
      return newContact;
    } catch (error) {
      console.error('Add contact error:', error);
      toast.error('Failed to add contact');
      throw error;
    }
  }, [userId]);

  const updateContact = useCallback(async (contactId: string, updates: Partial<AlertContact>) => {
    try {
      const response = await apiRequest('/api/alert-contacts', {
        method: 'PUT',
        body: JSON.stringify({ contactId, updates }),
      });
      
      const updatedContact = response.contact;
      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? updatedContact : contact
      ));
      toast.success('Contact updated successfully');
      return updatedContact;
    } catch (error) {
      console.error('Update contact error:', error);
      toast.error('Failed to update contact');
      throw error;
    }
  }, []);

  const deleteContact = useCallback(async (contactId: string) => {
    try {
      await apiRequest(`/api/alert-contacts?contactId=${contactId}`, {
        method: 'DELETE',
      });
      
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      toast.success('Contact deleted successfully');
    } catch (error) {
      console.error('Delete contact error:', error);
      toast.error('Failed to delete contact');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts
  };
}

// Location hook
export function useLocation() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocationDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      
      // Get location details from our API
      const response = await apiRequest('/api/location', {
        method: 'POST',
        body: JSON.stringify({ latitude, longitude }),
      });
      
      const locationData = response.location;
      setLocation(locationData);
      return locationData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      console.error('Location error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocationDetails,
    hasLocation: !!location
  };
}

// Subscription management hook
export function useSubscription() {
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = useCallback(async (
    userId: string, 
    priceType: 'PREMIUM_MONTHLY' | 'PREMIUM_YEARLY' = 'PREMIUM_MONTHLY',
    walletAddress?: string
  ) => {
    try {
      setLoading(true);
      
      const response = await apiRequest('/api/subscription/create-checkout', {
        method: 'POST',
        body: JSON.stringify({ userId, priceType, walletAddress }),
      });
      
      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url;
      }
      
      return response;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    createCheckoutSession
  };
}

// Recording hook
export function useRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      });
      
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setDuration(0);
      
      // Start duration timer
      const startTime = Date.now();
      const timer = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      // Store timer reference for cleanup
      (recorder as any).timer = timer;
      
      toast.success('Recording started');
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Failed to start recording');
      throw error;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      
      // Clear timer
      if ((mediaRecorder as any).timer) {
        clearInterval((mediaRecorder as any).timer);
      }
      
      setIsRecording(false);
      setMediaRecorder(null);
      toast.success('Recording stopped');
    }
  }, [mediaRecorder, isRecording]);

  const clearRecording = useCallback(() => {
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
      setRecordingUrl(null);
    }
    setDuration(0);
  }, [recordingUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && isRecording) {
        stopRecording();
      }
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
    };
  }, [mediaRecorder, isRecording, recordingUrl, stopRecording]);

  return {
    isRecording,
    duration,
    recordingUrl,
    startRecording,
    stopRecording,
    clearRecording,
    canRecord: 'MediaRecorder' in window && 'getUserMedia' in navigator.mediaDevices
  };
}
