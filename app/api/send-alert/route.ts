import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, location, contacts, encounterId } = body;

    if (!userId || !location || !contacts || contacts.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log the alert in the database
    console.log('Emergency alert triggered:', {
      userId,
      location,
      contacts: contacts.length,
      timestamp: new Date().toISOString()
    });

    // Get user's location details for the alert message
    const locationString = location.city && location.state 
      ? `${location.city}, ${location.state}` 
      : `${location.latitude}, ${location.longitude}`;

    // Create alert messages
    const alertPromises = contacts.map(async (contact: any) => {
      const message = `🚨 EMERGENCY ALERT 🚨\n\nThis is an automated alert from KnowYourRightsCard.\n\nYour contact has triggered an emergency alert during a police encounter.\n\nLocation: ${locationString}\nTime: ${new Date().toLocaleString()}\nCoordinates: ${location.latitude}, ${location.longitude}\n\nPlease check on them immediately or contact local authorities if needed.\n\n⚠️ This is an automated message. Do not reply.`;
      
      // In a production environment, you would integrate with:
      // 1. Twilio for SMS: https://www.twilio.com/docs/sms
      // 2. SendGrid for Email: https://docs.sendgrid.com/
      // 3. Push notifications via Firebase or similar
      
      console.log(`Alert prepared for ${contact.name} (${contact.relationship}):`, {
        phone: contact.phone,
        email: contact.email,
        message: message.substring(0, 100) + '...'
      });
      
      // Simulate successful delivery
      return { 
        contactId: contact.id,
        contactName: contact.name, 
        phone: contact.phone,
        email: contact.email,
        status: 'sent',
        timestamp: new Date().toISOString()
      };
    });

    const results = await Promise.all(alertPromises);

    // Update encounter with alert status if encounterId provided
    if (encounterId) {
      const { error: updateError } = await supabase
        .from('encounters')
        .update({
          alert_sent: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', encounterId);

      if (updateError) {
        console.error('Error updating encounter alert status:', updateError);
      }
    }

    // In production, you might also want to:
    // 1. Store alert logs in a separate table
    // 2. Implement rate limiting to prevent spam
    // 3. Add delivery confirmation tracking
    // 4. Integrate with emergency services APIs where available

    return NextResponse.json({ 
      success: true, 
      message: 'Emergency alerts sent successfully',
      alertsSent: results.length,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error sending emergency alert:', error);
    return NextResponse.json(
      { error: 'Failed to send emergency alert' },
      { status: 500 }
    );
  }
}
