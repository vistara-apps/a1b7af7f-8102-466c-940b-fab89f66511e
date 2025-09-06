'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  BookOpen,
  Mic,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  MapPin,
} from 'lucide-react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { NavHeader } from '@/components/NavHeader';
import { GuideCard } from '@/components/GuideCard';
import { ActionButton } from '@/components/ActionButton';
import { RecordButton } from '@/components/RecordButton';
import { RightsGuide } from '@/components/RightsGuide';
import { AlertSystem } from '@/components/AlertSystem';
import { LegalGuide, User, RecordingState, AlertContact } from '@/lib/types';
import { US_STATES } from '@/lib/constants';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [activeTab, setActiveTab] = useState<
    'home' | 'guides' | 'rights' | 'record' | 'alerts'
  >('home');
  const [user, setUser] = useState<User | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    duration: 0,
  });
  const [alertContacts, setAlertContacts] = useState<AlertContact[]>([]);
  const [selectedState, setSelectedState] = useState('CA');

  // Sample legal guides data
  const [legalGuides] = useState<LegalGuide[]>([
    {
      guideId: '1',
      title: 'Traffic Stop Rights',
      content:
        'During a traffic stop, you have the right to remain silent beyond providing your license, registration, and insurance. You can refuse consent to search your vehicle.',
      state: 'CA',
      language: 'en',
      type: 'traffic',
      isPremium: false,
    },
    {
      guideId: '2',
      title: 'Search and Seizure Protection',
      content:
        'The Fourth Amendment protects you from unreasonable searches. Police need a warrant, probable cause, or your consent to search your property.',
      state: 'CA',
      language: 'en',
      type: 'search',
      isPremium: true,
    },
    {
      guideId: '3',
      title: 'Arrest Procedures',
      content:
        'If you are arrested, you have the right to remain silent and the right to an attorney. Ask for a lawyer immediately and do not answer questions without one present.',
      state: 'CA',
      language: 'en',
      type: 'arrest',
      isPremium: true,
    },
  ]);

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Initialize user (in a real app, this would come from authentication)
  useEffect(() => {
    setUser({
      userId: 'demo-user',
      subscriptionStatus: 'free',
      preferredLanguage: 'en',
      savedStateLaws: ['CA'],
    });
  }, []);

  const handleStartRecording = () => {
    setRecordingState({
      isRecording: true,
      startTime: new Date(),
      duration: 0,
    });
  };

  const handleStopRecording = () => {
    setRecordingState({
      isRecording: false,
      duration: 0,
    });
  };

  const handleUpgrade = () => {
    // In a real app, this would redirect to payment processing
    alert('Upgrade to Premium for $4.99/month to unlock all features!');
  };

  const renderHomeContent = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow">
          KnowYourRightsCard
        </h1>
        <p className="text-xl text-purple-200 mb-8">
          Instant legal guidance in your pocket
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ActionButton
            variant="primary"
            onClick={() => setActiveTab('guides')}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Read Guides
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => setActiveTab('rights')}
          >
            <Shield className="h-5 w-5 mr-2" />
            Know Your Rights
          </ActionButton>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Constitutional Rights Card */}
        <div className="metric-card">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-purple-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                Constitutional Rights
              </h3>
              <p className="text-sm text-gray-300">One-page guides</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-2xl font-bold text-white">+269%</div>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Users report increased confidence during police encounters
          </p>
          <ActionButton
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('rights')}
          >
            View Rights
          </ActionButton>
        </div>

        {/* Recording Feature Card */}
        <div className="metric-card">
          <div className="flex items-center space-x-3 mb-4">
            <Mic className="h-8 w-8 text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                What to NOT say
              </h3>
              <p className="text-sm text-gray-300">One-tap recording</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-2xl font-bold text-white">+685%</div>
            <BarChart3 className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Increase in successful evidence documentation
          </p>
          <ActionButton
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('record')}
          >
            Start Recording
          </ActionButton>
        </div>

        {/* Location Alerts Card */}
        <div className="metric-card">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                Location Alerts
              </h3>
              <p className="text-sm text-gray-300">Emergency contacts</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-2xl font-bold text-white">Real-time</div>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Instant notification to trusted contacts during encounters
          </p>
          <ActionButton
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('alerts')}
          >
            Setup Alerts
          </ActionButton>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card-dark p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('record')}
            className="flex flex-col items-center space-y-2 p-4 bg-red-500 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
          >
            <Mic className="h-6 w-6 text-red-400" />
            <span className="text-sm text-white">Record</span>
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className="flex flex-col items-center space-y-2 p-4 bg-yellow-500 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
          >
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
            <span className="text-sm text-white">Alert</span>
          </button>
          <button
            onClick={() => setActiveTab('rights')}
            className="flex flex-col items-center space-y-2 p-4 bg-blue-500 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
          >
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-sm text-white">Rights</span>
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className="flex flex-col items-center space-y-2 p-4 bg-green-500 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
          >
            <BookOpen className="h-6 w-6 text-green-400" />
            <span className="text-sm text-white">Guides</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderGuidesContent = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Legal Guides</h2>
        <p className="text-purple-200">
          State-specific legal information and guidance
        </p>
      </div>

      {/* State Selector */}
      <div className="glass-card-dark p-4">
        <label className="block text-white font-medium mb-2">
          Select Your State:
        </label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {US_STATES.map((state) => (
            <option key={state.code} value={state.code} className="bg-gray-800">
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {/* Guides List */}
      <div className="space-y-4">
        {legalGuides
          .filter((guide) => guide.state === selectedState)
          .map((guide) => (
            <GuideCard
              key={guide.guideId}
              guide={guide}
              variant="preview"
              onUpgrade={handleUpgrade}
              userIsPremium={user?.subscriptionStatus === 'premium'}
            />
          ))}
      </div>

      {legalGuides.filter((guide) => guide.state === selectedState).length ===
        0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            No guides available for {selectedState} yet
          </p>
          <p className="text-gray-500">More states coming soon!</p>
        </div>
      )}
    </div>
  );

  const renderRecordContent = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Record Encounter</h2>
        <p className="text-purple-200">
          Document your interaction for legal protection
        </p>
      </div>

      <div className="flex justify-center">
        <RecordButton
          isRecording={recordingState.isRecording}
          duration={recordingState.duration}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />
      </div>

      {/* Recording Tips */}
      <div className="glass-card-dark p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Recording Tips
        </h3>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Inform the officer you are recording for your safety</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Keep your phone visible and avoid sudden movements</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>State the date, time, and location clearly</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Record continuously - don't stop and start</span>
          </li>
        </ul>
      </div>

      {/* Legal Notice */}
      <div className="glass-card-dark p-4 border-l-4 border-yellow-400">
        <p className="text-yellow-200 text-sm">
          <strong>Legal Notice:</strong> Recording laws vary by state. In most
          states, you have the right to record police in public spaces. Always
          comply with lawful orders while exercising your rights.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <NavHeader />

        {/* Tab Navigation */}
        <div className="glass-card p-2 mb-8">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'home', label: 'Home', icon: Shield },
              { id: 'guides', label: 'Guides', icon: BookOpen },
              { id: 'rights', label: 'Rights', icon: Shield },
              { id: 'record', label: 'Record', icon: Mic },
              { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[60vh]">
          {activeTab === 'home' && renderHomeContent()}
          {activeTab === 'guides' && renderGuidesContent()}
          {activeTab === 'rights' && (
            <RightsGuide
              language={user?.preferredLanguage || 'en'}
              userIsPremium={user?.subscriptionStatus === 'premium'}
            />
          )}
          {activeTab === 'record' && renderRecordContent()}
          {activeTab === 'alerts' && (
            <AlertSystem
              contacts={alertContacts}
              onContactsChange={setAlertContacts}
            />
          )}
        </div>
      </div>
    </div>
  );
}
