import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { startScoring, getScoringStatus } from '@/api/scoring.api';
import type { ScoringInfo } from '@/types/api';
import { useScoringStream } from './useScoringStream';

export function useScoring(vacancyId: string) {
  const queryClient = useQueryClient();
  const [retryKey, setRetryKey] = useState(0);
  const { event, isConnected, error: streamError } = useScoringStream(vacancyId, retryKey);
  const [streamClosed, setStreamClosed] = useState(false);

  useEffect(() => {
    setStreamClosed(false);
  }, [vacancyId]);

  useEffect(() => {
    if (!isConnected && event) {
      setStreamClosed(true);
    }
    if (streamError && !event) {
      setStreamClosed(true);
    }
  }, [isConnected, event, streamError]);

  const { data: fallbackStatus } = useQuery({
    queryKey: ['scoring', 'status', vacancyId],
    queryFn: () => getScoringStatus(vacancyId),
    enabled: streamClosed,
    retry: false,
  });

  const { mutate: start, isPending: isStarting, error: startError } = useMutation({
    mutationFn: () => startScoring(vacancyId),
    onSuccess: () => {
      setStreamClosed(false);
      setRetryKey((prev) => prev + 1);
      queryClient.invalidateQueries({ queryKey: ['scoring', 'status', vacancyId] });
      queryClient.invalidateQueries({ queryKey: ['resumes', vacancyId], exact: false });
    },
  });

  const activeEvent = event || (streamClosed ? fallbackStatus : null);
  const status: ScoringInfo | null = activeEvent
    ? { status: activeEvent.status, errorMessage: activeEvent.errorMessage }
    : null;

  const isLoading = !event && !fallbackStatus && !streamError && isConnected;

  return {
    status,
    isStatusLoading: isLoading,
    statusError: streamError && !event && !fallbackStatus ? streamError : null,
    start,
    isStarting,
    startError,
    progressEvent: event,
  };
}
