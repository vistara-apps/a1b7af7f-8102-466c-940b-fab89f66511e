'use client';

import { GuideCardProps } from '@/lib/types';
import { Lock, BookOpen, Globe } from 'lucide-react';
import { truncateText } from '@/lib/utils';

export function GuideCard({ guide, variant = 'preview', onClick }: GuideCardProps) {
  const isPreview = variant === 'preview';
  const displayContent = isPreview ? truncateText(guide.content, 150) : guide.content;

  return (
    <div 
      className={`feature-card ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-purple-300" />
          <h3 className="text-lg font-semibold text-white">{guide.title}</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {guide.language === 'es' && (
            <Globe className="h-4 w-4 text-blue-300" />
          )}
          {guide.isPremium && (
            <Lock className="h-4 w-4 text-yellow-400" />
          )}
        </div>
      </div>

      <div className="mb-4">
        <span className="inline-block bg-purple-500 bg-opacity-30 text-purple-200 text-xs px-2 py-1 rounded-full">
          {guide.state}
        </span>
        <span className="inline-block bg-blue-500 bg-opacity-30 text-blue-200 text-xs px-2 py-1 rounded-full ml-2">
          {guide.type}
        </span>
      </div>

      <p className="text-gray-200 text-sm leading-relaxed mb-4">
        {displayContent}
      </p>

      {isPreview && (
        <div className="flex items-center justify-between">
          <button 
            className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors duration-200"
            onClick={onClick}
          >
            Read More →
          </button>
          
          {guide.isPremium && (
            <span className="text-yellow-400 text-xs font-medium">
              Premium
            </span>
          )}
        </div>
      )}
    </div>
  );
}
