'use client';

import { MiniKit, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';
import { useState } from 'react';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string, username: string, isVerified: boolean) => void;
}

export function AuthDrawer({ isOpen, onClose, onSuccess }: AuthDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWorldIDSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Trigger World ID verification
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: 'speedleague_auth',
        verification_level: VerificationLevel.Orb, // Use Orb level for verified humans
      });

      if (finalPayload.status === 'error') {
        throw new Error(finalPayload.error_code || 'Verification failed');
      }

      // Send verification to backend
      const response = await fetch('/api/auth/worldid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proof: finalPayload.proof,
          nullifier_hash: finalPayload.nullifier_hash,
          verification_level: finalPayload.verification_level,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store user ID in localStorage
      localStorage.setItem('speedleague_userId', data.userId);
      localStorage.setItem('speedleague_isVerified', String(data.isVerified));

      // Call success callback
      onSuccess(data.userId, data.username, data.isVerified);
      onClose();

    } catch (err) {
      console.error('World ID sign-in error:', err);
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/guest', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create guest account');
      }

      // Store user ID in localStorage
      localStorage.setItem('speedleague_userId', data.userId);
      localStorage.setItem('speedleague_isVerified', 'false');

      // Call success callback
      onSuccess(data.userId, data.username, false);
      onClose();

    } catch (err) {
      console.error('Guest sign-in error:', err);
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-md rounded-t-3xl bg-gradient-to-b from-slate-900 to-slate-950 p-6 pb-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl">⚡</div>
          <h2 className="text-2xl font-bold text-white">Welcome to SpeedLeague</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to save your progress and compete globally
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* World ID Sign In Button */}
        <button
          onClick={handleWorldIDSignIn}
          disabled={isLoading}
          className="mb-3 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              Sign in with World ID
            </span>
          )}
        </button>

        {/* Verified Badge Info */}
        <div className="mb-4 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
          <p className="text-xs text-blue-300">
            ✓ Get verified status and compete on global leaderboards
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-950 px-2 text-slate-500">or</span>
          </div>
        </div>

        {/* Guest Sign In Button */}
        <button
          onClick={handleGuestSignIn}
          disabled={isLoading}
          className="w-full rounded-xl bg-slate-800 px-6 py-4 font-semibold text-white transition-all hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue as Guest
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-sm text-slate-400 hover:text-slate-300"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
