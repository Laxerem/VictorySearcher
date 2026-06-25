import { useEffect, useState } from 'react';
import { streamScoringProgress } from '@/api/scoring.api';
import type { ScoringProgressEvent } from '@/types/api';

interface UseScoringStreamState {
  event: ScoringProgressEvent | null;
  isConnected: boolean;
  error: Error | null;
}

export function useScoringStream(vacancyId: string, retryKey: number = 0) {
  const [state, setState] = useState<UseScoringStreamState>({
    event: null,
    isConnected: false,
    error: null,
  });

  useEffect(() => {
    if (!vacancyId) return;

    let mounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        if (mounted) {
          setState(prev => ({ ...prev, isConnected: true, error: null }));
        }

        await streamScoringProgress(
          vacancyId,
          (event) => {
            if (mounted) {
              setState(prev => ({ ...prev, event, isConnected: true, error: null }));
            }
          },
          (error) => {
            if (mounted) {
              setState(prev => ({ ...prev, isConnected: false, error }));
            }
          },
          controller.signal
        );

        if (mounted) {
          setState(prev => ({ ...prev, isConnected: false }));
        }
      } catch (e) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            isConnected: false,
            error: e instanceof Error ? e : new Error(String(e)),
          }));
        }
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [vacancyId, retryKey]);

  return state;
}
