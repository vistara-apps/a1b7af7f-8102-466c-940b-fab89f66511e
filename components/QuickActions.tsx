'use client';

import { useState, useEffect } from 'react';
import { Mic, AlertTriangle, MapPin, Phone } from 'lucide-react';
import { RecordButton } from './RecordButton';
import { ActionButton } from './ActionButton';
import { getCurrentLocation } from '@/lib/utils';

export function QuickActions() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [alertSent, setAlertSent] = useState(false);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleToggleRecording = async () => {
    if (!isRecording) {
      // Start recording
      try {
        const locationData = await getCurrentLocation();
        setLocation({
          lat: locationData.coords.latitude,
          lng: locationData.coords.longitude,
        });
        setRecordingDuration(0);
        setIsRecording(true);

        // In a real app, you would start actual audio/video recording here
        console.log('Recording started at:', locationData);
      } catch (error) {
        console.error('Failed to get location:', error);
        // Still allow recording without location
        setRecordingDuration(0);
        setIsRecording(true);
      }
    } else {
      // Stop recording
      setIsRecording(false);
      console.log('Recording stopped. Duration:', recordingDuration, 'seconds');

      // In a real app, you would save the recording and generate a summary
    }
  };

  const handleSendAlert = async () => {
    try {
      const locationData = await getCurrentLocation();
      setLocation({
        lat: locationData.coords.latitude,
        lng: locationData.coords.longitude,
      });
      setAlertSent(true);

      // In a real app, you would send alerts to emergency contacts
      console.log('Alert sent with location:', locationData);

      // Reset alert status after 3 seconds
      setTimeout(() => setAlertSent(false), 3000);
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  };

  const handleEmergencyCall = () => {
    // In a real app, this would initiate a call to emergency services
    window.open('tel:911');
  };

  return (
    <div className="glass-card-dark p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recording Section */}
        <div className="text-center">
          <h3 className="text-white font-semibold mb-4">Record Encounter</h3>
          <RecordButton
            variant={isRecording ? 'active' : 'inactive'}
            isRecording={isRecording}
            onStartRecording={() => handleToggleRecording()}
            onStopRecording={() => handleToggleRecording()}
            duration={recordingDuration}
          />
          <p className="text-gray-300 text-sm mt-2">
            Tap to start/stop recording
          </p>
        </div>

        {/* Alert Section */}
        <div className="text-center">
          <h3 className="text-white font-semibold mb-4">Send Alert</h3>
          <ActionButton
            variant={alertSent ? 'secondary' : 'alert'}
            onClick={handleSendAlert}
            disabled={alertSent}
            className="w-full"
          >
            <AlertTriangle className="h-5 w-5" />
            {alertSent ? 'Alert Sent!' : 'Alert Contacts'}
          </ActionButton>
          <p className="text-gray-300 text-sm mt-2">
            Notify emergency contacts
          </p>
        </div>

        {/* Emergency Call Section */}
        <div className="text-center">
          <h3 className="text-white font-semibold mb-4">Emergency</h3>
          <ActionButton
            variant="alert"
            onClick={handleEmergencyCall}
            className="w-full"
          >
            <Phone className="h-5 w-5" />
            Call 911
          </ActionButton>
          <p className="text-gray-300 text-sm mt-2">Direct emergency line</p>
        </div>
      </div>

      {/* Location Status */}
      {location && (
        <div className="mt-6 p-4 bg-green-500 bg-opacity-20 rounded-lg border border-green-500 border-opacity-30">
          <div className="flex items-center space-x-2 text-green-300">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              Location captured: {location.lat.toFixed(4)},{' '}
              {location.lng.toFixed(4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
