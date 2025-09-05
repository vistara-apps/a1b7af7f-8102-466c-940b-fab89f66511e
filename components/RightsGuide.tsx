'use client';

import { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { BASIC_RIGHTS, EMERGENCY_SCRIPTS } from '@/lib/constants';
import { ActionButton } from './ActionButton';

export function RightsGuide() {
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es'>('en');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const scripts = EMERGENCY_SCRIPTS[selectedLanguage];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Know Your Rights</h2>
        <p className="text-gray-200 max-w-2xl mx-auto">
          Understanding your constitutional rights is the first step to protecting yourself during police encounters.
        </p>
      </div>

      {/* Language Toggle */}
      <div className="flex justify-center mb-6">
        <div className="glass-card p-1 flex rounded-lg">
          <button
            onClick={() => setSelectedLanguage('en')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedLanguage === 'en'
                ? 'bg-purple-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLanguage('es')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedLanguage === 'es'
                ? 'bg-purple-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Español
          </button>
        </div>
      </div>

      {/* Basic Rights Section */}
      <div className="glass-card-dark">
        <button
          onClick={() => toggleSection('basic')}
          className="w-full p-6 flex items-center justify-between text-left"
        >
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-purple-300" />
            <h3 className="text-xl font-semibold text-white">Basic Constitutional Rights</h3>
          </div>
          {expandedSection === 'basic' ? (
            <ChevronUp className="h-5 w-5 text-gray-300" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-300" />
          )}
        </button>
        
        {expandedSection === 'basic' && (
          <div className="px-6 pb-6">
            <div className="space-y-3">
              {BASIC_RIGHTS.map((right, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-200">{right}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Scripts Section */}
      <div className="glass-card-dark">
        <button
          onClick={() => toggleSection('scripts')}
          className="w-full p-6 flex items-center justify-between text-left"
        >
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-blue-300" />
            <h3 className="text-xl font-semibold text-white">Emergency Scripts</h3>
            <Lock className="h-4 w-4 text-yellow-400" />
          </div>
          {expandedSection === 'scripts' ? (
            <ChevronUp className="h-5 w-5 text-gray-300" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-300" />
          )}
        </button>
        
        {expandedSection === 'scripts' && (
          <div className="px-6 pb-6">
            <div className="space-y-4">
              <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-lg p-4 mb-4">
                <p className="text-yellow-200 text-sm">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Premium feature - Upgrade to access state-specific scripts and translations
                </p>
              </div>
              
              {Object.entries(scripts).map(([key, script]) => (
                <div key={key} className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-gray-200 text-sm italic">"{script}"</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <ActionButton variant="primary" className="w-full">
                Upgrade for Full Access
              </ActionButton>
            </div>
          </div>
        )}
      </div>

      {/* State-Specific Laws Section */}
      <div className="glass-card-dark">
        <button
          onClick={() => toggleSection('state')}
          className="w-full p-6 flex items-center justify-between text-left"
        >
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-green-300" />
            <h3 className="text-xl font-semibold text-white">State-Specific Laws</h3>
            <Lock className="h-4 w-4 text-yellow-400" />
          </div>
          {expandedSection === 'state' ? (
            <ChevronUp className="h-5 w-5 text-gray-300" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-300" />
          )}
        </button>
        
        {expandedSection === 'state' && (
          <div className="px-6 pb-6">
            <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-lg p-4 mb-4">
              <p className="text-yellow-200 text-sm">
                <Lock className="h-4 w-4 inline mr-1" />
                Premium feature - Get laws specific to your state and situation
              </p>
            </div>
            
            <p className="text-gray-200 mb-4">
              Laws vary significantly by state. Premium members get access to:
            </p>
            
            <ul className="space-y-2 text-gray-200">
              <li>• Stop and identify laws by state</li>
              <li>• Recording laws and restrictions</li>
              <li>• Search and seizure variations</li>
              <li>• Local ordinances and procedures</li>
            </ul>
            
            <div className="mt-6">
              <ActionButton variant="primary" className="w-full">
                Upgrade for State-Specific Guides
              </ActionButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
