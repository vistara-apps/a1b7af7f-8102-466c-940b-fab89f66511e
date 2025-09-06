import { NextRequest, NextResponse } from 'next/server';

interface LocationRequest {
  latitude: number;
  longitude: number;
}

interface LocationResponse {
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LocationRequest = await request.json();
    const { latitude, longitude } = body;

    // Validate coordinates
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields: latitude and longitude' },
        { status: 400 }
      );
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    // Use a free geocoding service (OpenStreetMap Nominatim)
    // In production, you might want to use Google Maps API or similar
    const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

    try {
      const response = await fetch(geocodeUrl, {
        headers: {
          'User-Agent': 'KnowYourRightsCard/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Geocoding service error: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.error) {
        return NextResponse.json({
          error: 'Location not found',
          latitude,
          longitude,
        });
      }

      // Extract location information
      const address = data.address || {};
      const locationInfo: LocationResponse = {
        city: address.city || address.town || address.village || address.hamlet,
        state: address.state,
        country: address.country,
        address: data.display_name,
      };

      // For US locations, try to get more specific state information
      if (
        locationInfo.country === 'United States' ||
        address.country_code === 'us'
      ) {
        // Map state names to abbreviations if needed
        const stateAbbreviations: { [key: string]: string } = {
          Alabama: 'AL',
          Alaska: 'AK',
          Arizona: 'AZ',
          Arkansas: 'AR',
          California: 'CA',
          Colorado: 'CO',
          Connecticut: 'CT',
          Delaware: 'DE',
          Florida: 'FL',
          Georgia: 'GA',
          Hawaii: 'HI',
          Idaho: 'ID',
          Illinois: 'IL',
          Indiana: 'IN',
          Iowa: 'IA',
          Kansas: 'KS',
          Kentucky: 'KY',
          Louisiana: 'LA',
          Maine: 'ME',
          Maryland: 'MD',
          Massachusetts: 'MA',
          Michigan: 'MI',
          Minnesota: 'MN',
          Mississippi: 'MS',
          Missouri: 'MO',
          Montana: 'MT',
          Nebraska: 'NE',
          Nevada: 'NV',
          'New Hampshire': 'NH',
          'New Jersey': 'NJ',
          'New Mexico': 'NM',
          'New York': 'NY',
          'North Carolina': 'NC',
          'North Dakota': 'ND',
          Ohio: 'OH',
          Oklahoma: 'OK',
          Oregon: 'OR',
          Pennsylvania: 'PA',
          'Rhode Island': 'RI',
          'South Carolina': 'SC',
          'South Dakota': 'SD',
          Tennessee: 'TN',
          Texas: 'TX',
          Utah: 'UT',
          Vermont: 'VT',
          Virginia: 'VA',
          Washington: 'WA',
          'West Virginia': 'WV',
          Wisconsin: 'WI',
          Wyoming: 'WY',
          'District of Columbia': 'DC',
        };

        if (locationInfo.state && stateAbbreviations[locationInfo.state]) {
          locationInfo.state = stateAbbreviations[locationInfo.state];
        }
      }

      return NextResponse.json({
        ...locationInfo,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
    } catch (geocodeError) {
      console.error('Geocoding error:', geocodeError);

      // Return basic location info even if geocoding fails
      return NextResponse.json({
        latitude,
        longitude,
        error: 'Unable to determine address, but coordinates recorded',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Location API error:', error);
    return NextResponse.json(
      { error: 'Failed to process location request' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing location services
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Missing lat and lon query parameters' },
      { status: 400 }
    );
  }

  // Forward to POST endpoint
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );
}
