'use client';

import { Shield } from 'lucide-react';
import { ActionButton } from '@/components/ActionButton';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Something went wrong!
          </h2>
          <p className="text-gray-300 mb-6">
            We encountered an error while loading your rights guide. Please try again.
          </p>
        </div>
        
        <div className="space-y-4">
          <ActionButton variant="primary" onClick={reset} className="w-full">
            Try Again
          </ActionButton>
          
          <ActionButton 
            variant="secondary" 
            onClick={() => window.location.href = '/'} 
            className="w-full"
          >
            Go Home
          </ActionButton>
        </div>
        
        {error.digest && (
          <p className="text-xs text-gray-400 mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
