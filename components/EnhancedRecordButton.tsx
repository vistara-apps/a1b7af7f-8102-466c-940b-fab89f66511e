'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Play, Pause, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDuration, isAudioRecordingSupported, startAudioRecording } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import toast from 'react-hot-toast';

interface EnhancedRecordButtonProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  className?: string;
}

export function EnhancedRecordButton({ onRecordingComplete, className = '' }: EnhancedRecordButtonProps) {
  const { state, startRecording, stopRecording } = useApp();
  const { recordingState } = state;
  
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingSupported, setRecordingSupported] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if recording is supported
  useEffect(() => {
    setRecordingSupported(isAudioRecordingSupported());
  }, []);

  // Timer for recording duration
  useEffect(() => {
    if (recordingState.isRecording) {
      timerRef.current = setInterval(() => {
        // This would be handled by the context in a real implementation
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingState.isRecording]);

  const handleStartRecording = async () => {
    if (!recordingSupported) {
      toast.error('Audio recording is not supported in this browser');
      return;
    }

    try {
      const recorder = await startAudioRecording();
      if (!recorder) {
        toast.error('Failed to start recording');
        return;
      }

      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        
        setAudioChunks(chunks);
        setAudioUrl(url);
        
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, recordingState.duration);
        }
      };

      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      await startRecording();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const handleStopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      
      // Stop all tracks to release microphone
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    
    await stopRecording();
    setMediaRecorder(null);
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `encounter-recording-${new Date().toISOString().slice(0, 19)}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Recording downloaded');
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  if (!recordingSupported) {
    return (
      <div className={`text-center p-6 ${className}`}>
        <MicOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">
          Audio recording is not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className={`text-center space-y-6 ${className}`}>
      {/* Main Record Button */}
      <div className="relative">
        <motion.button
          onClick={recordingState.isRecording ? handleStopRecording : handleStartRecording}
          className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            recordingState.isRecording
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
              : 'bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {recordingState.isRecording ? (
              <motion.div
                key="stop"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Square className="h-8 w-8 text-white fill-current" />
              </motion.div>
            ) : (
              <motion.div
                key="record"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Mic className="h-8 w-8 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Recording pulse animation */}
          {recordingState.isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-red-300"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.3, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.button>
      </div>

      {/* Recording Status */}
      <div className="space-y-2">
        <div className="text-2xl font-mono text-white">
          {formatDuration(recordingState.duration)}
        </div>
        
        <div className="text-sm text-gray-300">
          {recordingState.isRecording ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>Recording in progress...</span>
            </div>
          ) : audioUrl ? (
            <span>Recording completed</span>
          ) : (
            <span>Tap to start recording</span>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <AnimatePresence>
        {audioUrl && !recordingState.isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center space-x-4"
          >
            <button
              onClick={handlePlayPause}
              className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white ml-1" />
              )}
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
              title="Download recording"
            >
              <Download className="h-5 w-5 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}

      {/* Recording Tips */}
      <div className="text-xs text-gray-400 max-w-md mx-auto">
        <p>
          {recordingState.isRecording
            ? "Keep your device steady and speak clearly. Tap the square to stop recording."
            : "Your recording will be saved locally and can be downloaded for your records."
          }
        </p>
      </div>
    </div>
  );
}
