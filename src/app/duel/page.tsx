'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import DuelArena from '@/components/game/DuelArena';
import ResultScreen from '@/components/game/ResultScreen';
import { AttemptResponse } from '@/types';

export default function DuelPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [gameState, setGameState] = useState<'playing' | 'result'>('playing');
  const [result, setResult] = useState<AttemptResponse | null>(null);
  const [lastReactionMs, setLastReactionMs] = useState<number>(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  useEffect(() => {
    const storedUserId = localStorage.getItem('speedleague_user_id');
    if (!storedUserId) {
      router.push('/');
      return;
    }
    setUserId(storedUserId);

    // Fetch current attempts remaining
    fetchAttemptsRemaining(storedUserId);
  }, [router]);

  const fetchAttemptsRemaining = async (uid: string) => {
    try {
      const response = await fetch(`/api/stats/${uid}`);
      if (response.ok) {
        const data = await response.json();
        setAttemptsRemaining(data.attemptsRemaining);
      }
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };

  const handleComplete = async (reactionMs: number, isFalseStart: boolean) => {
    setLastReactionMs(reactionMs);
    
    try {
      const response = await fetch('/api/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          reactionMs,
          isFalseStart,
          timestamp: new Date().toISOString(),
          deviceInfo: {
            userAgent: navigator.userAgent,
          },
        }),
      });

      if (response.ok) {
        const data: AttemptResponse = await response.json();
        setResult(data);
        setAttemptsRemaining(data.attemptsRemaining);
        
        // Only show result screen if not a false start
        if (!isFalseStart) {
          setGameState('result');
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit attempt');
        router.push('/');
      }
    } catch (error) {
      console.error('Error submitting attempt:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleTryAgain = () => {
    setGameState('playing');
    setResult(null);
  };

  const handleViewLeaderboard = () => {
    router.push('/leaderboard');
  };

  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Button variant="light" onPress={handleBackHome}>
          ← Back
        </Button>
      </div>

      {/* Game Area */}
      {gameState === 'playing' && (
        <DuelArena
          onComplete={handleComplete}
          attemptsRemaining={attemptsRemaining}
        />
      )}

      {gameState === 'result' && result && (
        <ResultScreen
          reactionMs={lastReactionMs}
          percentile={result.currentPercentile}
          rank={result.rank}
          isDailyBest={result.isDailyBest}
          attemptsRemaining={result.attemptsRemaining}
          onTryAgain={handleTryAgain}
          onViewLeaderboard={handleViewLeaderboard}
        />
      )}
    </div>
  );
}
