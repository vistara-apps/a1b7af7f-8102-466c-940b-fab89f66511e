'use client';

import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { NavHeader } from '@/components/NavHeader';
import { FeatureGrid } from '@/components/FeatureGrid';
import { QuickActions } from '@/components/QuickActions';
import { RightsGuide } from '@/components/RightsGuide';
import { ActionButton } from '@/components/ActionButton';
import { Shield, Star, Users, Zap } from 'lucide-react';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <NavHeader variant="transparent" />

      {/* Hero Section */}
      <section className="px-4 py-12 text-center">
        <div className="max-w-screen-lg mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              KnowYourRightsCard
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              What you need to guide or constitutional rights answering interactions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ActionButton variant="primary" size="lg">
                Know Your Rights
              </ActionButton>
              <ActionButton variant="secondary" size="lg">
                Watch Demo
              </ActionButton>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-4 py-8">
        <div className="max-w-screen-lg mx-auto">
          <FeatureGrid />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-8">
        <div className="max-w-screen-lg mx-auto">
          <QuickActions />
        </div>
      </section>

      {/* Additional Feature Cards */}
      <section className="px-4 py-8">
        <div className="max-w-screen-lg mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Location Card */}
            <div className="glass-card-dark p-4">
              <h3 className="text-white font-semibold mb-2">Location</h3>
              <p className="text-gray-300 text-sm mb-4">
                Cross-reference your encounter tips from the provided climate. 
                Learn about and get the respective target.
              </p>
              <button className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors duration-200">
                View Precise Local summary Generator →
              </button>
            </div>

            {/* Wait Card */}
            <div className="glass-card-dark p-4">
              <h3 className="text-white font-semibold mb-2">Wait</h3>
              <p className="text-gray-300 text-sm mb-4">
                One hour coaching for ensuring to assembly, generally.
              </p>
            </div>

            {/* Location Card 2 */}
            <div className="glass-card-dark p-4">
              <h3 className="text-white font-semibold mb-2">Location</h3>
              <p className="text-gray-300 text-sm mb-4">
                Geolocation-aware de-escalation tips about into local.
              </p>
            </div>

            {/* Chatter Card */}
            <div className="glass-card-dark p-4">
              <h3 className="text-white font-semibold mb-2">Chatter</h3>
              <p className="text-gray-300 text-sm mb-4">
                Display-based record conversation boundaries a service.
              </p>
              <div className="flex items-center justify-end">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rights Guide Section */}
      <section id="rights" className="px-4 py-12">
        <div className="max-w-screen-lg mx-auto">
          <RightsGuide />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 py-12">
        <div className="max-w-screen-lg mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Choose Your Plan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card-dark p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <div className="text-4xl font-bold text-white mb-4">$0</div>
                <p className="text-gray-300">Basic rights information</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-200">
                  <Shield className="h-5 w-5 text-green-400 mr-3" />
                  Basic constitutional rights guide
                </li>
                <li className="flex items-center text-gray-200">
                  <Shield className="h-5 w-5 text-green-400 mr-3" />
                  Simple recording timer
                </li>
                <li className="flex items-center text-gray-200">
                  <Shield className="h-5 w-5 text-green-400 mr-3" />
                  Emergency contact list
                </li>
              </ul>
              
              <ActionButton variant="secondary" className="w-full">
                Get Started Free
              </ActionButton>
            </div>

            {/* Premium Plan */}
            <div className="glass-card-dark p-8 border-2 border-purple-500 border-opacity-50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $4.99<span className="text-lg text-gray-300">/month</span>
                </div>
                <p className="text-gray-300">Complete legal protection toolkit</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-200">
                  <Star className="h-5 w-5 text-yellow-400 mr-3" />
                  State-specific laws & scripts
                </li>
                <li className="flex items-center text-gray-200">
                  <Star className="h-5 w-5 text-yellow-400 mr-3" />
                  Advanced recording features
                </li>
                <li className="flex items-center text-gray-200">
                  <Star className="h-5 w-5 text-yellow-400 mr-3" />
                  Location-based alert system
                </li>
                <li className="flex items-center text-gray-200">
                  <Star className="h-5 w-5 text-yellow-400 mr-3" />
                  AI-generated summaries
                </li>
                <li className="flex items-center text-gray-200">
                  <Star className="h-5 w-5 text-yellow-400 mr-3" />
                  Multi-language support
                </li>
              </ul>
              
              <ActionButton variant="primary" className="w-full">
                Upgrade to Premium
              </ActionButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-white border-opacity-20">
        <div className="max-w-screen-lg mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">KnowYourRightsCard</span>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Empowering citizens with knowledge to protect their constitutional rights.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-300">
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
