'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';

interface DuelArenaProps {
  onComplete: (reactionMs: number, isFalseStart: boolean) => void;
  attemptsRemaining: number;
}

type GameState = 'ready' | 'waiting' | 'strike' | 'result';

export default function DuelArena({ onComplete, attemptsRemaining }: DuelArenaProps) {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [isFalseStart, setIsFalseStart] = useState(false);

  const startGame = useCallback(() => {
    setGameState('waiting');
    setIsFalseStart(false);
    setReactionTime(0);

    // Random delay between 1.5-5 seconds
    const delay = 1500 + Math.random() * 3500;

    setTimeout(() => {
      setStartTime(performance.now());
      setGameState('strike');
    }, delay);
  }, []);

  const handleTap = useCallback(() => {
    if (gameState === 'waiting') {
      // False start
      setIsFalseStart(true);
      setReactionTime(0);
      setGameState('result');
      onComplete(0, true);
    } else if (gameState === 'strike') {
      // Valid tap
      const endTime = performance.now();
      const reaction = Math.round(endTime - startTime);
      setReactionTime(reaction);
      setGameState('result');
      onComplete(reaction, false);
    }
  }, [gameState, startTime, onComplete]);

  const resetGame = () => {
    setGameState('ready');
    setReactionTime(0);
    setIsFalseStart(false);
  };

  // Handle keyboard input (space bar)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (gameState === 'waiting' || gameState === 'strike')) {
        e.preventDefault();
        handleTap();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, handleTap]);

  if (attemptsRemaining <= 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardBody className="text-center py-12">
          <div className="text-2xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold mb-2">No Attempts Remaining</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Come back tomorrow for more attempts!
          </p>
        </CardBody>
      </Card>
    );
  }

  if (gameState === 'ready') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardBody className="text-center py-12">
          <h2 className="text-3xl font-bold mb-6">Ready for Duel?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            When the screen turns green, tap as fast as you can!
          </p>
          <Button
            size="lg"
            color="primary"
            className="text-xl px-8 py-6"
            onPress={startGame}
          >
            START DUEL
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Attempts remaining: {attemptsRemaining}
          </p>
        </CardBody>
      </Card>
    );
  }

  if (gameState === 'waiting') {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black cursor-pointer animate-pulse"
        onClick={handleTap}
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Wait for it...
          </h1>
          <p className="text-gray-400 text-lg">
            Don&apos;t tap yet!
          </p>
        </div>
      </div>
    );
  }

  if (gameState === 'strike') {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-green-500 cursor-pointer"
        onClick={handleTap}
      >
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            TAP NOW!
          </h1>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    if (isFalseStart) {
      return (
        <Card className="w-full max-w-2xl mx-auto bg-red-50 dark:bg-red-950">
          <CardBody className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
              False Start!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You tapped too early. Wait for the screen to turn green!
            </p>
            <Button
              size="lg"
              color="primary"
              onPress={resetGame}
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
      );
    }

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardBody className="text-center py-12">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-5xl font-bold mb-4">
            {reactionTime}ms
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Processing your result...
          </p>
        </CardBody>
      </Card>
    );
  }

  return null;
}
