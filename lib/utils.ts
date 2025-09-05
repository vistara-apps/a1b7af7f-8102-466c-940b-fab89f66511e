import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format duration in MM:SS format
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Get current location
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

// Generate encounter summary using AI
export async function generateEncounterSummary(
  encounter: {
    timestamp: Date;
    location: { latitude: number; longitude: number; state?: string; city?: string };
    duration?: number;
  }
): Promise<string> {
  try {
    const response = await fetch('/api/generate-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(encounter),
    });

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    return `Encounter recorded on ${encounter.timestamp.toLocaleDateString()} at ${encounter.timestamp.toLocaleTimeString()}. Location: ${encounter.location.city || 'Unknown'}, ${encounter.location.state || 'Unknown'}. Duration: ${encounter.duration ? formatDuration(encounter.duration) : 'Unknown'}.`;
  }
}

// Send emergency alert
export async function sendEmergencyAlert(
  userId: string,
  location: { latitude: number; longitude: number; city?: string; state?: string },
  contacts: Array<{ id: string; name: string; phone?: string; email?: string; relationship: string }>,
  encounterId?: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/send-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, location, contacts, encounterId }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending alert:', error);
    return false;
  }
}

// Check if user has premium subscription
export function isPremiumUser(subscriptionStatus: string): boolean {
  return subscriptionStatus === 'premium';
}

// Get state from coordinates (simplified)
export function getStateFromCoordinates(lat: number, lng: number): string {
  // This is a simplified implementation
  // In a real app, you'd use a proper geocoding service
  if (lat >= 32.5 && lat <= 42 && lng >= -124 && lng <= -114) return 'CA';
  if (lat >= 25 && lat <= 31 && lng >= -87 && lng <= -80) return 'FL';
  if (lat >= 40.5 && lat <= 45 && lng >= -79.8 && lng <= -71.8) return 'NY';
  if (lat >= 25.8 && lat <= 36.5 && lng >= -106.6 && lng <= -93.5) return 'TX';
  // Add more state mappings as needed
  return 'Unknown';
}

// API request helper with error handling
export async function apiRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Local storage helpers with error handling
export const storage = {
  get: (key: string) => {
    try {
      if (typeof window === 'undefined') return null;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key: string) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100); // Convert cents to dollars
}

// Validate phone number (basic US format)
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

// Validate email address
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Format location for display
export function formatLocation(location: { latitude: number; longitude: number; city?: string; state?: string }): string {
  if (location.city && location.state) {
    return `${location.city}, ${location.state}`;
  }
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

// Check if feature is available (for progressive enhancement)
export function isFeatureAvailable(feature: string): boolean {
  switch (feature) {
    case 'geolocation':
      return 'geolocation' in navigator;
    case 'mediaRecorder':
      return 'MediaRecorder' in window;
    case 'notifications':
      return 'Notification' in window;
    case 'serviceWorker':
      return 'serviceWorker' in navigator;
    default:
      return false;
  }
}
