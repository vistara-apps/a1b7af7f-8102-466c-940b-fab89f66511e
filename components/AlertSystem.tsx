'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Plus,
  X,
  Send,
} from 'lucide-react';
import { AlertContact } from '@/lib/types';
import { getCurrentLocation } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import { ActionButton } from './ActionButton';

interface AlertSystemProps {
  contacts?: AlertContact[];
  onContactsChange?: (contacts: AlertContact[]) => void;
}

export function AlertSystem({
  contacts = [],
  onContactsChange,
}: AlertSystemProps) {
  const { sendAlert: sendEmergencyAlertViaContext } = useApp();
  const [alertContacts, setAlertContacts] = useState<AlertContact[]>(contacts);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: '',
  });
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isSendingAlert, setIsSendingAlert] = useState(false);

  useEffect(() => {
    // Check if geolocation is available and get current location
    if (navigator.geolocation) {
      getCurrentLocation()
        .then((position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocationEnabled(true);
        })
        .catch((error) => {
          console.error('Error getting location:', error);
          setIsLocationEnabled(false);
        });
    }
  }, []);

  const addContact = () => {
    if (newContact.name && (newContact.phone || newContact.email)) {
      const contact: AlertContact = {
        id: Date.now().toString(),
        name: newContact.name,
        phone: newContact.phone || undefined,
        email: newContact.email || undefined,
        relationship: newContact.relationship,
      };

      const updatedContacts = [...alertContacts, contact];
      setAlertContacts(updatedContacts);
      onContactsChange?.(updatedContacts);

      setNewContact({ name: '', phone: '', email: '', relationship: '' });
      setIsAddingContact(false);
    }
  };

  const removeContact = (id: string) => {
    const updatedContacts = alertContacts.filter(
      (contact) => contact.id !== id
    );
    setAlertContacts(updatedContacts);
    onContactsChange?.(updatedContacts);
  };

  const sendAlert = async () => {
    if (alertContacts.length === 0) return;

    setIsSendingAlert(true);
    try {
      const success = await sendEmergencyAlertViaContext();
      if (success) {
        // Show success message
        alert('Emergency alert sent successfully!');
      } else {
        alert('Failed to send alert. Please try again.');
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      alert('Error sending alert. Please try again.');
    } finally {
      setIsSendingAlert(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-400" />
          <h2 className="text-2xl font-bold text-white">Emergency Alerts</h2>
        </div>
        <p className="text-purple-200">
          Set up trusted contacts for emergency situations
        </p>
      </div>

      {/* Location Status */}
      <div className="glass-card-dark p-4">
        <div className="flex items-center space-x-3">
          <MapPin
            className={`h-5 w-5 ${isLocationEnabled ? 'text-green-400' : 'text-red-400'}`}
          />
          <div>
            <p className="text-white font-medium">
              Location Services: {isLocationEnabled ? 'Enabled' : 'Disabled'}
            </p>
            <p className="text-sm text-gray-300">
              {isLocationEnabled
                ? 'Your location will be shared with emergency contacts'
                : 'Enable location services to use emergency alerts'}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Alert Button */}
      <div className="text-center">
        <ActionButton
          variant="alert"
          size="lg"
          fullWidth
          disabled={!isLocationEnabled || alertContacts.length === 0}
          loading={isSendingAlert}
          onClick={sendAlert}
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          Send Emergency Alert
        </ActionButton>
        {(!isLocationEnabled || alertContacts.length === 0) && (
          <p className="text-sm text-gray-400 mt-2">
            {!isLocationEnabled
              ? 'Location services required'
              : 'Add emergency contacts to enable alerts'}
          </p>
        )}
      </div>

      {/* Emergency Contacts */}
      <div className="glass-card-dark p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            Emergency Contacts
          </h3>
          <button
            onClick={() => setIsAddingContact(true)}
            className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Contact List */}
        <div className="space-y-3">
          {alertContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg"
            >
              <div>
                <p className="text-white font-medium">{contact.name}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  {contact.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                </div>
                {contact.relationship && (
                  <p className="text-xs text-purple-200">
                    {contact.relationship}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeContact(contact.id)}
                className="text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {alertContacts.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No emergency contacts added yet</p>
              <p className="text-sm">Add contacts to enable emergency alerts</p>
            </div>
          )}
        </div>

        {/* Add Contact Form */}
        {isAddingContact && (
          <div className="mt-6 p-4 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10">
            <h4 className="text-lg font-medium text-white mb-4">
              Add Emergency Contact
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name *"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newContact.email}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Relationship (e.g., Family, Friend, Lawyer)"
                value={newContact.relationship}
                onChange={(e) =>
                  setNewContact({ ...newContact, relationship: e.target.value })
                }
                className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center space-x-3 mt-4">
              <ActionButton
                variant="primary"
                onClick={addContact}
                disabled={
                  !newContact.name || (!newContact.phone && !newContact.email)
                }
              >
                Add Contact
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => {
                  setIsAddingContact(false);
                  setNewContact({
                    name: '',
                    phone: '',
                    email: '',
                    relationship: '',
                  });
                }}
              >
                Cancel
              </ActionButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
