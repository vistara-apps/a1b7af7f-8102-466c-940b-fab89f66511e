import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: encounters, error } = await supabase
      .from('encounters')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching encounters:', error);
      return NextResponse.json(
        { error: 'Failed to fetch encounters' },
        { status: 500 }
      );
    }

    // Transform database format to frontend format
    const transformedEncounters = encounters.map(encounter => ({
      encounterId: encounter.id,
      userId: encounter.user_id,
      timestamp: new Date(encounter.timestamp),
      location: encounter.location,
      recordingUrl: encounter.recording_url,
      summary: encounter.summary,
      alertSent: encounter.alert_sent,
      duration: encounter.duration
    }));

    return NextResponse.json({ encounters: transformedEncounters });

  } catch (error) {
    console.error('Encounters API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, location, alertSent = false, duration } = body;

    if (!userId || !location) {
      return NextResponse.json(
        { error: 'User ID and location are required' },
        { status: 400 }
      );
    }

    const encounterId = uuidv4();
    const { data: newEncounter, error } = await supabase
      .from('encounters')
      .insert({
        id: encounterId,
        user_id: userId,
        timestamp: new Date().toISOString(),
        location,
        alert_sent: alertSent,
        duration
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating encounter:', error);
      return NextResponse.json(
        { error: 'Failed to create encounter' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      encounter: {
        encounterId: newEncounter.id,
        userId: newEncounter.user_id,
        timestamp: new Date(newEncounter.timestamp),
        location: newEncounter.location,
        recordingUrl: newEncounter.recording_url,
        summary: newEncounter.summary,
        alertSent: newEncounter.alert_sent,
        duration: newEncounter.duration
      }
    });

  } catch (error) {
    console.error('Create encounter error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { encounterId, updates } = body;

    if (!encounterId) {
      return NextResponse.json(
        { error: 'Encounter ID is required' },
        { status: 400 }
      );
    }

    const { data: updatedEncounter, error } = await supabase
      .from('encounters')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', encounterId)
      .select()
      .single();

    if (error) {
      console.error('Error updating encounter:', error);
      return NextResponse.json(
        { error: 'Failed to update encounter' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      encounter: {
        encounterId: updatedEncounter.id,
        userId: updatedEncounter.user_id,
        timestamp: new Date(updatedEncounter.timestamp),
        location: updatedEncounter.location,
        recordingUrl: updatedEncounter.recording_url,
        summary: updatedEncounter.summary,
        alertSent: updatedEncounter.alert_sent,
        duration: updatedEncounter.duration
      }
    });

  } catch (error) {
    console.error('Update encounter error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
