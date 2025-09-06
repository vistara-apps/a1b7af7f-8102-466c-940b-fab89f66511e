'use client';

import { useState } from 'react';
import { ChevronRight, Lock, BookOpen, AlertTriangle } from 'lucide-react';
import { LegalGuide } from '@/lib/types';

interface GuideCardProps {
  guide: LegalGuide;
  variant?: 'preview' | 'full';
  onUpgrade?: () => void;
  userIsPremium?: boolean;
}

export function GuideCard({
  guide,
  variant = 'preview',
  onUpgrade,
  userIsPremium = false,
}: GuideCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const canAccess = !guide.isPremium || userIsPremium;

  const handleClick = () => {
    if (!canAccess && onUpgrade) {
      onUpgrade();
      return;
    }

    if (variant === 'preview') {
      setIsExpanded(!isExpanded);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'traffic':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'search':
        return <BookOpen className="h-5 w-5 text-blue-400" />;
      case 'arrest':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default:
        return <BookOpen className="h-5 w-5 text-green-400" />;
    }
  };

  return (
    <div
      className={`guide-card ${variant === 'preview' ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getTypeIcon(guide.type)}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-white">
                {guide.title}
              </h3>
              {guide.isPremium && <Lock className="h-4 w-4 text-yellow-400" />}
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm text-purple-200 bg-purple-500 bg-opacity-30 px-2 py-1 rounded">
                {guide.state}
              </span>
              <span className="text-sm text-blue-200 bg-blue-500 bg-opacity-30 px-2 py-1 rounded">
                {guide.language === 'en' ? 'English' : 'Español'}
              </span>
            </div>

            {(variant === 'full' || isExpanded) && canAccess && (
              <div className="text-gray-200 leading-relaxed">
                <p>{guide.content}</p>
              </div>
            )}

            {(variant === 'full' || isExpanded) && !canAccess && (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">
                  This guide requires a premium subscription
                </p>
                <button onClick={onUpgrade} className="btn-primary">
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        </div>

        {variant === 'preview' && (
          <ChevronRight
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        )}
      </div>

      {!canAccess && variant === 'preview' && (
        <div className="mt-4 p-3 bg-yellow-500 bg-opacity-20 rounded-lg border border-yellow-400 border-opacity-30">
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-yellow-200">Premium feature</span>
          </div>
        </div>
      )}
    </div>
  );
}
