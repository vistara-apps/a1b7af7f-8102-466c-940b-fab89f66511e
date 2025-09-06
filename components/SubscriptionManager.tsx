'use client';

import React, { useState } from 'react';
import { Crown, Check, X, ExternalLink, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { createSubscription, getSubscriptionPortalUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

interface SubscriptionManagerProps {
  onClose?: () => void;
}

export function SubscriptionManager({ onClose }: SubscriptionManagerProps) {
  const { state } = useApp();
  const { user } = state;
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const isPremium = user?.subscriptionStatus === 'premium';

  const features = [
    {
      name: 'Basic Rights Guides',
      free: true,
      premium: true,
      description: 'Constitutional rights overview',
    },
    {
      name: 'State-Specific Scripts',
      free: false,
      premium: true,
      description: 'Tailored legal scripts for your state',
    },
    {
      name: 'Advanced Recording Features',
      free: false,
      premium: true,
      description: 'Enhanced audio recording with cloud backup',
    },
    {
      name: 'Emergency Alert System',
      free: false,
      premium: true,
      description: 'Real-time location alerts to contacts',
    },
    {
      name: 'AI-Generated Summaries',
      free: false,
      premium: true,
      description: 'Professional encounter documentation',
    },
    {
      name: 'Multi-Language Support',
      free: false,
      premium: true,
      description: 'Spanish translations and scripts',
    },
    {
      name: 'Priority Support',
      free: false,
      premium: true,
      description: '24/7 customer support access',
    },
  ];

  const handleUpgrade = async () => {
    if (!user || !email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const { url } = await createSubscription(
        user.userId,
        email,
        `${window.location.origin}?upgrade=success`,
        `${window.location.origin}?upgrade=cancelled`
      );

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to start subscription process');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const portalUrl = await getSubscriptionPortalUrl(
        user.userId,
        window.location.origin
      );

      // Open customer portal in new tab
      window.open(portalUrl, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {isPremium ? 'Premium Subscription' : 'Upgrade to Premium'}
                </h2>
                <p className="text-purple-100">
                  {isPremium
                    ? 'You have access to all premium features'
                    : 'Unlock advanced legal protection tools'}
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Current Status */}
          {isPremium && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Premium subscription active
                </span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                You have access to all premium features and priority support.
              </p>
            </div>
          )}

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Free</h3>
                <div className="text-3xl font-bold text-gray-900 mt-2">$0</div>
                <p className="text-gray-500">Basic legal guidance</p>
              </div>

              <ul className="space-y-3">
                {features
                  .filter((f) => f.free)
                  .map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        {feature.name}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-purple-500 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Recommended
                </span>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Premium</h3>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  $4.99
                  <span className="text-lg font-normal text-gray-500">
                    /month
                  </span>
                </div>
                <p className="text-gray-500">Complete legal protection</p>
              </div>

              <ul className="space-y-3 mb-6">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    {feature.premium ? (
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${feature.premium ? 'text-gray-700' : 'text-gray-400'}`}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {!isPremium && (
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />

                  <button
                    onClick={handleUpgrade}
                    disabled={isLoading || !email}
                    className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        <span>Upgrade Now</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Feature Comparison
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-700">Feature</th>
                    <th className="text-center py-2 text-gray-700">Free</th>
                    <th className="text-center py-2 text-gray-700">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {feature.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {feature.description}
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3">
                        {feature.free ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manage Subscription */}
          {isPremium && (
            <div className="text-center">
              <button
                onClick={handleManageSubscription}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Manage Subscription</span>
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="text-center text-xs text-gray-500 mt-6">
            <p>
              🔒 Secure payment processing by Stripe. Cancel anytime.
              <br />
              Your subscription helps us maintain and improve our legal guidance
              services.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
