// World ID verification utilities
import { WorldIDVerification } from '@/types';

export async function verifyWorldIDProof(
  verification: WorldIDVerification
): Promise<{ success: boolean; error?: string }> {
  const { proof, merkle_root, nullifier_hash } = verification;

  try {
    // Call World ID verification API
    const response = await fetch(
      `https://developer.worldcoin.org/api/v1/verify/${process.env.NEXT_PUBLIC_WORLD_ID_APP_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proof,
          merkle_root,
          nullifier_hash,
          action: process.env.WORLD_ID_ACTION || 'speedleague_verify',
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || 'Verification failed',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('World ID verification error:', error);
    return {
      success: false,
      error: 'Network error during verification',
    };
  }
}

export function generateNullifierHash(proof: string): string {
  // This is a placeholder - in production, this would be handled by the World ID SDK
  // The nullifier_hash is provided by the World ID proof
  return proof;
}
