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
  status: 'active' | 'completed' | 'cancelled';
}

// Legal guide data model
export interface LegalGuide {
  guideId: string;
  title: string;
  content: string;
  state: string;
  language: 'en' | 'es';
  type: 'rights' | 'scripts' | 'procedures';
  isPremium: boolean;
}

// Component props interfaces
export interface GuideCardProps {
  guide: LegalGuide;
  variant?: 'preview' | 'full';
  onClick?: () => void;
}

export interface ActionButtonProps {
  variant: 'primary' | 'secondary' | 'alert';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface RecordButtonProps {
  variant: 'active' | 'inactive';
  isRecording: boolean;
  onToggle: () => void;
  duration?: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Location data
export interface LocationData {
  latitude: number;
  longitude: number;
  state?: string;
  city?: string;
  accuracy?: number;
}

// Alert contact
export interface AlertContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  relationship: string;
}

// Subscription tiers
export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionFeatures {
  stateSpecificScripts: boolean;
  advancedRecording: boolean;
  alertSystem: boolean;
  aiSummaries: boolean;
  multiLanguage: boolean;
}
