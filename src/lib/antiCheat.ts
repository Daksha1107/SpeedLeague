import { ValidationResult } from '@/types';

export function validateAttempt(
  reactionMs: number,
  timestamp: string,
  isFalseStart: boolean
): ValidationResult {
  const flags: string[] = [];
  let isValid = true;

  // 1. Range validation: 100ms ≤ reactionMs ≤ 2000ms
  if (reactionMs < 100 || reactionMs > 2000) {
    flags.push('INVALID_RANGE');
    isValid = false;
  }

  // 2. False start should have reaction time of 0
  if (isFalseStart && reactionMs !== 0) {
    flags.push('FALSE_START_MISMATCH');
    isValid = false;
  }

  // 3. Timestamp freshness: within 10 seconds of server time
  const attemptTime = new Date(timestamp).getTime();
  const serverTime = Date.now();
  const timeDiff = Math.abs(serverTime - attemptTime);

  if (timeDiff > 10000) {
    // 10 seconds in milliseconds
    flags.push('TIMESTAMP_MISMATCH');
    isValid = false;
  }

  // 4. Suspicious speed detection (sub-150ms is very rare)
  if (reactionMs < 150 && !isFalseStart) {
    flags.push('SUSPICIOUS_SPEED');
    // Still valid, but flagged for monitoring
  }

  // Don't save false starts or invalid attempts
  const shouldSave = isValid && !isFalseStart;

  return {
    isValid,
    flags,
    shouldSave,
  };
}

// Additional anti-cheat utilities

export function detectStatisticalAnomaly(
  recentAttempts: number[],
  currentAttempt: number
): boolean {
  // If user has >3 attempts and >95% are sub-150ms, flag as suspicious
  if (recentAttempts.length >= 3) {
    const subThresholdCount = recentAttempts.filter((ms) => ms < 150).length;
    const percentage = (subThresholdCount / recentAttempts.length) * 100;

    if (percentage > 95 && currentAttempt < 150) {
      return true;
    }
  }

  return false;
}

export function detectIdenticalPatterns(attempts: number[]): boolean {
  // Check if multiple consecutive attempts are identical
  if (attempts.length < 3) return false;

  let identicalCount = 1;
  for (let i = 1; i < attempts.length; i++) {
    if (attempts[i] === attempts[i - 1]) {
      identicalCount++;
      if (identicalCount >= 3) {
        return true;
      }
    } else {
      identicalCount = 1;
    }
  }

  return false;
}
