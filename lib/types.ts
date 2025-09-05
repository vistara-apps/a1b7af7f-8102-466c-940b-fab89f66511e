// User data model
export interface User {
  userId: string;
  walletAddress?: string;
  subscriptionStatus: 'free' | 'premium';
  preferredLanguage: 'en' | 'es';
  savedStateLaws: string[];
}

// Encounter data model
export interface Encounter {
  encounterId: string;
  userId: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    state?: string;
    city?: string;
  };
  recordingUrl?: string;
  summary?: string;
  alertSent: boolean;
  duration?: number;
}

// Legal guide data model
export interface LegalGuide {
  guideId: string;
  title: string;
  content: string;
  state: string;
  language: 'en' | 'es';
  type: 'basic' | 'traffic' | 'search' | 'arrest';
  isPremium: boolean;
}

// Recording state
export interface RecordingState {
  isRecording: boolean;
  startTime?: Date;
  duration: number;
  audioUrl?: string;
}

// Alert contact
export interface AlertContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  relationship: string;
}

// App state
export interface AppState {
  user: User | null;
  currentEncounter: Encounter | null;
  recordingState: RecordingState;
  alertContacts: AlertContact[];
  selectedState: string;
  isLocationEnabled: boolean;
}
