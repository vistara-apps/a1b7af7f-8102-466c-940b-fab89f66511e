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
  location: { latitude: number; longitude: number },
  contacts: Array<{ name: string; phone?: string; email?: string }>
): Promise<boolean> {
  try {
    const response = await fetch('/api/send-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location, contacts }),
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
