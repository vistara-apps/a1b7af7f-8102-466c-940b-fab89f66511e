'use client';

import { RecordButtonProps } from '@/lib/types';
import { Mic, MicOff, Square } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

export function RecordButton({ 
  variant, 
  isRecording, 
  onToggle, 
  duration = 0 
}: RecordButtonProps) {
  const buttonClasses = isRecording
    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse-slow'
    : 'bg-green-500 hover:bg-green-600 text-white';

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={onToggle}
        className={`${buttonClasses} w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl`}
      >
        {isRecording ? (
          <Square className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </button>
      
      {isRecording && (
        <div className="text-center">
          <div className="text-white font-mono text-lg">
            {formatDuration(duration)}
          </div>
          <div className="text-red-300 text-sm">
            Recording...
          </div>
        </div>
      )}
      
      {!isRecording && duration > 0 && (
        <div className="text-center">
          <div className="text-white font-mono text-sm">
            Last: {formatDuration(duration)}
          </div>
        </div>
      )}
    </div>
  );
}
