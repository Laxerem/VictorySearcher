import { useEffect, useRef, useState } from 'react';
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

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!vacancyId) return;

    let mounted = true;

    (async () => {
      try {
        if (mounted) {
          setState(prev => ({ ...prev, isConnected: true, error: null }));
        }

        const unsubscribe = await streamScoringProgress(
          vacancyId,
          (event) => {
            if (mounted) {
              setState(prev => ({
                ...prev,
                event,
                isConnected: true,
                error: null,
              }));
            }
          },
          (error) => {
            if (mounted) {
              setState(prev => ({
                ...prev,
                isConnected: false,
                error,
              }));
            }
          }
        );

        if (mounted) {
          unsubscribeRef.current = unsubscribe;
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
      unsubscribeRef.current?.();
    };
  }, [vacancyId, retryKey]);

  return state;
}
