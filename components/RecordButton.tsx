'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface RecordButtonProps {
  variant?: 'active' | 'inactive';
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  isRecording?: boolean;
  duration?: number;
}

export function RecordButton({
  variant = 'inactive',
  onStartRecording,
  onStopRecording,
  isRecording = false,
  duration = 0
}: RecordButtonProps) {
  const [internalDuration, setInternalDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setInternalDuration(prev => prev + 1);
      }, 1000);
    } else {
      setInternalDuration(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const displayDuration = duration || internalDuration;

  const handleClick = () => {
    if (isRecording) {
      onStopRecording?.();
    } else {
      onStartRecording?.();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleClick}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl
          ${isRecording ? 'record-button-active' : 'record-button-inactive'}
        `}
      >
        {isRecording ? (
          <Square className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
        
        {isRecording && (
          <div className="absolute -inset-2 rounded-full border-2 border-red-400 animate-ping opacity-75" />
        )}
      </button>

      <div className="text-center">
        <div className="text-2xl font-mono text-white font-bold">
          {formatDuration(displayDuration)}
        </div>
        <div className="text-sm text-purple-200">
          {isRecording ? 'Recording...' : 'Tap to Record'}
        </div>
      </div>

      {isRecording && (
        <div className="flex items-center space-x-2 text-red-400">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">LIVE</span>
        </div>
      )}
    </div>
  );
}
