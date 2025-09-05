'use client';

import { Shield, MapPin, Mic, AlertTriangle } from 'lucide-react';
import { MetricCard } from './MetricCard';

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Know Your Rights */}
      <div className="feature-card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-purple-500 bg-opacity-30 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-purple-300" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Constitutional Rights</h3>
            <p className="text-gray-300 text-sm">One-page guides</p>
          </div>
        </div>
        
        <p className="text-gray-200 text-sm mb-4">
          What to say and what NOT to say during police encounters. Know your constitutional rights and how to assert them safely.
        </p>
        
        <div className="flex items-center justify-between">
          <button className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors duration-200">
            View Guides →
          </button>
          <div className="w-16 h-16 relative">
            <div className="w-full h-full border-4 border-purple-500 border-opacity-30 rounded-full"></div>
            <div className="absolute inset-2 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-purple-300 text-xs font-bold">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* State-Specific Laws */}
      <MetricCard
        title="What to NOT say"
        value="+269%"
        change="One key recording"
        trend="up"
        description="One thing to learn and avoid. Potentially serious hit on your legal or safety encounter."
        icon={<Mic className="h-6 w-6" />}
      />

      {/* Location-Based Alerts */}
      <MetricCard
        title="Location What to say"
        value="+685%"
        change="Location Summary"
        trend="up"
        description="One page guides for different States about your journey and learn their State enforcement."
        icon={<MapPin className="h-6 w-6" />}
      />
    </div>
  );
}
