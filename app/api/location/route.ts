import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Use a reverse geocoding service to get location details
    // In production, you might use Google Maps API, MapBox, or similar
    // For now, we'll use a simple state mapping based on coordinates
    
    const location = {
      latitude,
      longitude,
      state: getStateFromCoordinates(latitude, longitude),
      city: await getCityFromCoordinates(latitude, longitude)
    };

    return NextResponse.json({ location });

  } catch (error) {
    console.error('Location API error:', error);
    return NextResponse.json(
      { error: 'Failed to get location details' },
      { status: 500 }
    );
  }
}

// Simple state detection based on coordinates
// In production, use a proper geocoding service
function getStateFromCoordinates(lat: number, lng: number): string {
  // This is a very simplified mapping - use proper geocoding in production
  if (lat >= 32.5 && lat <= 42 && lng >= -124.4 && lng <= -114.1) return 'CA';
  if (lat >= 25.8 && lat <= 31 && lng >= -106.6 && lng <= -93.5) return 'TX';
  if (lat >= 40.5 && lat <= 45.0 && lng >= -79.8 && lng <= -71.8) return 'NY';
  if (lat >= 38.8 && lat <= 39.7 && lng >= -77.1 && lng <= -76.9) return 'DC';
  if (lat >= 25.1 && lat <= 31.0 && lng >= -87.6 && lng <= -80.0) return 'FL';
  
  // Default fallback
  return 'US';
}

// Simple city detection - in production use proper geocoding
async function getCityFromCoordinates(lat: number, lng: number): Promise<string> {
  try {
    // In production, you would use a service like:
    // const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.MAPBOX_TOKEN}`);
    // const data = await response.json();
    // return data.features[0]?.place_name || 'Unknown';
    
    // For demo purposes, return a generic city name
    const cities = ['Downtown', 'Midtown', 'Uptown', 'City Center', 'Main Street Area'];
    return cities[Math.floor(Math.random() * cities.length)];
  } catch (error) {
    console.error('Error getting city name:', error);
    return 'Unknown';
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');

    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required' },
        { status: 400 }
      );
    }

    // Return state-specific information
    const stateInfo = getStateInfo(state);
    
    return NextResponse.json({ stateInfo });

  } catch (error) {
    console.error('State info API error:', error);
    return NextResponse.json(
      { error: 'Failed to get state information' },
      { status: 500 }
    );
  }
}

function getStateInfo(state: string) {
  const stateData: Record<string, any> = {
    'CA': {
      name: 'California',
      recordingLaws: 'One-party consent state - you can record conversations you are part of',
      policeRecordingRights: 'You have the right to record police in public spaces',
      stopAndFrisk: 'Police need reasonable suspicion of criminal activity',
      searchRights: 'Police need a warrant, probable cause, or consent to search',
      emergencyNumber: '911',
      civilRightsHotline: '1-800-884-1684'
    },
    'TX': {
      name: 'Texas',
      recordingLaws: 'One-party consent state - you can record conversations you are part of',
      policeRecordingRights: 'You have the right to record police in public spaces',
      stopAndFrisk: 'Police need reasonable suspicion of criminal activity',
      searchRights: 'Police need a warrant, probable cause, or consent to search',
      emergencyNumber: '911',
      civilRightsHotline: '1-800-884-1684'
    },
    'NY': {
      name: 'New York',
      recordingLaws: 'One-party consent state - you can record conversations you are part of',
      policeRecordingRights: 'You have the right to record police in public spaces',
      stopAndFrisk: 'Police can stop and frisk with reasonable suspicion',
      searchRights: 'Police need a warrant, probable cause, or consent to search',
      emergencyNumber: '911',
      civilRightsHotline: '1-800-884-1684'
    }
  };

  return stateData[state] || {
    name: state,
    recordingLaws: 'Check your local laws regarding recording',
    policeRecordingRights: 'Generally allowed in public spaces',
    stopAndFrisk: 'Varies by jurisdiction',
    searchRights: 'Fourth Amendment protections apply',
    emergencyNumber: '911',
    civilRightsHotline: '1-800-884-1684'
  };
}
