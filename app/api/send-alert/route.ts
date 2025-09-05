import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// In production, you would integrate with services like:
// - Twilio for SMS
// - SendGrid for email
// - Push notification services

interface AlertContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  relationship: string;
}

interface AlertRequest {
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
  };
  contacts: AlertContact[];
  encounterId?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AlertRequest = await request.json();
    const { userId, location, contacts, encounterId, message } = body;

    // Validate required fields
    if (!userId || !location || !contacts || contacts.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, location, and contacts' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const alertId = uuidv4();

    // Create encounter record if not provided
    let currentEncounterId = encounterId;
    if (!currentEncounterId) {
      try {
        const encounter = await dbHelpers.createEncounter({
          encounter_id: uuidv4(),
          user_id: userId,
          timestamp,
          location,
          alert_sent: true,
        });
        currentEncounterId = encounter.encounter_id;
      } catch (dbError) {
        console.error('Error creating encounter:', dbError);
        // Continue with alert even if DB fails
      }
    } else {
      // Update existing encounter to mark alert as sent
      try {
        await dbHelpers.updateEncounter(currentEncounterId, { alert_sent: true });
      } catch (dbError) {
        console.error('Error updating encounter:', dbError);
      }
    }

    // Generate location string for human readability
    const locationString = location.city && location.state 
      ? `${location.city}, ${location.state}` 
      : `${location.latitude}, ${location.longitude}`;

    // Create alert message
    const alertMessage = message || 
      `🚨 EMERGENCY ALERT: I have triggered an emergency alert during a police encounter. ` +
      `Location: ${locationString}. Time: ${new Date(timestamp).toLocaleString()}. ` +
      `Please check on me immediately. If you cannot reach me, consider contacting local authorities.`;

    // Send alerts to all contacts
    const alertPromises = contacts.map(async (contact: AlertContact) => {
      const contactResult = {
        contactId: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        smsStatus: 'not_attempted',
        emailStatus: 'not_attempted',
        error: null as string | null,
      };

      try {
        // SMS Alert (if phone number provided)
        if (contact.phone) {
          // In production, integrate with Twilio:
          // const smsResult = await twilioClient.messages.create({
          //   body: alertMessage,
          //   from: process.env.TWILIO_PHONE_NUMBER,
          //   to: contact.phone
          // });
          
          console.log(`SMS Alert sent to ${contact.name} (${contact.phone}):`, alertMessage);
          contactResult.smsStatus = 'sent';
        }

        // Email Alert (if email provided)
        if (contact.email) {
          // In production, integrate with SendGrid:
          // const emailResult = await sgMail.send({
          //   to: contact.email,
          //   from: process.env.SENDGRID_FROM_EMAIL,
          //   subject: '🚨 Emergency Alert - Immediate Attention Required',
          //   text: alertMessage,
          //   html: `<p><strong>${alertMessage}</strong></p>`
          // });
          
          console.log(`Email Alert sent to ${contact.name} (${contact.email}):`, alertMessage);
          contactResult.emailStatus = 'sent';
        }

        return contactResult;
      } catch (error) {
        console.error(`Error sending alert to ${contact.name}:`, error);
        contactResult.error = error instanceof Error ? error.message : 'Unknown error';
        return contactResult;
      }
    });

    const results = await Promise.all(alertPromises);

    // Log the alert event
    console.log('Emergency alert triggered:', {
      alertId,
      userId,
      encounterId: currentEncounterId,
      location,
      contactCount: contacts.length,
      timestamp,
      results
    });

    // Calculate success metrics
    const totalAttempts = results.reduce((acc, result) => {
      return acc + (result.phone ? 1 : 0) + (result.email ? 1 : 0);
    }, 0);

    const successfulSends = results.reduce((acc, result) => {
      return acc + 
        (result.smsStatus === 'sent' ? 1 : 0) + 
        (result.emailStatus === 'sent' ? 1 : 0);
    }, 0);

    return NextResponse.json({ 
      success: true,
      alertId,
      encounterId: currentEncounterId,
      message: 'Emergency alerts processed',
      timestamp,
      location: locationString,
      summary: {
        contactsNotified: contacts.length,
        totalAttempts,
        successfulSends,
        failedSends: totalAttempts - successfulSends
      },
      results 
    });
  } catch (error) {
    console.error('Error sending emergency alert:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send emergency alert',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
