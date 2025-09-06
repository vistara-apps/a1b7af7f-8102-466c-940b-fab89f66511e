import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertContact } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format duration in MM:SS format
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Format duration in human readable format
export function formatDurationHuman(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

// Get current location with enhanced error handling
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        let errorMessage = 'Unable to retrieve location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  });
}

// Enhanced location services
export async function getLocationInfo(latitude: number, longitude: number) {
  try {
    const response = await fetch('/api/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
      throw new Error('Failed to get location info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting location info:', error);
    return {
      latitude,
      longitude,
      error: 'Unable to determine address',
    };
  }
}

// Generate encounter summary using AI
export async function generateEncounterSummary(encounter: {
  encounterId?: string;
  userId?: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    state?: string;
    city?: string;
  };
  duration?: number;
  additionalNotes?: string;
}): Promise<string> {
  try {
    const response = await fetch('/api/generate-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(encounter),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate summary');
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    return `Encounter recorded on ${encounter.timestamp.toLocaleDateString()} at ${encounter.timestamp.toLocaleTimeString()}. Location: ${encounter.location.city || 'Unknown'}, ${encounter.location.state || 'Unknown'}. Duration: ${encounter.duration ? formatDuration(encounter.duration) : 'Unknown'}.`;
  }
}

// Generate state-specific legal scripts
export async function generateLegalScript(
  state: string,
  language: 'en' | 'es',
  scenario: 'traffic' | 'search' | 'arrest' | 'general',
  userIsPremium: boolean
): Promise<{ script: string; isPremium: boolean }> {
  try {
    const response = await fetch('/api/generate-scripts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state, language, scenario, userIsPremium }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 403) {
        throw new Error(
          'Premium subscription required for state-specific scripts'
        );
      }
      throw new Error(errorData.error || 'Failed to generate script');
    }

    const data = await response.json();
    return {
      script: data.script,
      isPremium: data.isPremium,
    };
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
}

// Send emergency alert with enhanced functionality
export async function sendEmergencyAlert(
  userId: string,
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
  },
  contacts: AlertContact[],
  encounterId?: string,
  message?: string
): Promise<{
  success: boolean;
  alertId?: string;
  encounterId?: string;
  summary?: any;
  error?: string;
}> {
  try {
    const response = await fetch('/api/send-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        location,
        contacts,
        encounterId,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send alert');
    }

    return {
      success: true,
      alertId: data.alertId,
      encounterId: data.encounterId,
      summary: data.summary,
    };
  } catch (error) {
    console.error('Error sending alert:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Subscription management
export async function createSubscription(
  userId: string,
  email: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string; sessionId: string }> {
  const response = await fetch('/api/create-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, email, successUrl, cancelUrl }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create subscription');
  }

  return await response.json();
}

export async function getSubscriptionPortalUrl(
  userId: string,
  returnUrl: string
): Promise<string> {
  const response = await fetch(
    `/api/create-subscription?userId=${userId}&action=portal&returnUrl=${encodeURIComponent(returnUrl)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get portal URL');
  }

  const data = await response.json();
  return data.url;
}

// Check if user has premium subscription
export function isPremiumUser(subscriptionStatus: string): boolean {
  return subscriptionStatus === 'premium';
}

// Validate phone number format
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

// Storage utilities for offline functionality
export function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// Audio recording utilities
export function isAudioRecordingSupported(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

export async function startAudioRecording(): Promise<MediaRecorder | null> {
  if (!isAudioRecordingSupported()) {
    throw new Error('Audio recording is not supported in this browser');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    return mediaRecorder;
  } catch (error) {
    console.error('Error starting audio recording:', error);
    throw new Error(
      'Failed to start audio recording. Please check microphone permissions.'
    );
  }
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

// Date utilities
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
