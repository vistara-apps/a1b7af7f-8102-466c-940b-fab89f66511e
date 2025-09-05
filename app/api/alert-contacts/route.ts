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

    const { data: contacts, error } = await supabase
      .from('alert_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alert contacts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch alert contacts' },
        { status: 500 }
      );
    }

    // Transform database format to frontend format
    const transformedContacts = contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      relationship: contact.relationship
    }));

    return NextResponse.json({ contacts: transformedContacts });

  } catch (error) {
    console.error('Alert contacts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, phone, email, relationship } = body;

    if (!userId || !name || !relationship) {
      return NextResponse.json(
        { error: 'User ID, name, and relationship are required' },
        { status: 400 }
      );
    }

    if (!phone && !email) {
      return NextResponse.json(
        { error: 'Either phone or email is required' },
        { status: 400 }
      );
    }

    const contactId = uuidv4();
    const { data: newContact, error } = await supabase
      .from('alert_contacts')
      .insert({
        id: contactId,
        user_id: userId,
        name,
        phone,
        email,
        relationship
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating alert contact:', error);
      return NextResponse.json(
        { error: 'Failed to create alert contact' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      contact: {
        id: newContact.id,
        name: newContact.name,
        phone: newContact.phone,
        email: newContact.email,
        relationship: newContact.relationship
      }
    });

  } catch (error) {
    console.error('Create alert contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactId, updates } = body;

    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const { data: updatedContact, error } = await supabase
      .from('alert_contacts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', contactId)
      .select()
      .single();

    if (error) {
      console.error('Error updating alert contact:', error);
      return NextResponse.json(
        { error: 'Failed to update alert contact' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      contact: {
        id: updatedContact.id,
        name: updatedContact.name,
        phone: updatedContact.phone,
        email: updatedContact.email,
        relationship: updatedContact.relationship
      }
    });

  } catch (error) {
    console.error('Update alert contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('contactId');

    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('alert_contacts')
      .delete()
      .eq('id', contactId);

    if (error) {
      console.error('Error deleting alert contact:', error);
      return NextResponse.json(
        { error: 'Failed to delete alert contact' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete alert contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
