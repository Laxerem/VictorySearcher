import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { startScoring, getScoringStatus } from '@/api/scoring.api';
import type { ScoringStatusDto } from '@/types/api';

export function useScoring(vacancyId: string) {
  const queryClient = useQueryClient();

  const {
    data: status,
    isLoading: isStatusLoading,
    error: statusError,
  } = useQuery({
    queryKey: ['scoring', 'status', vacancyId],
    queryFn: () => getScoringStatus(vacancyId),
    retry: false,
    refetchInterval: (query) => {
      const current = query.state.data as ScoringStatusDto | undefined;
      return current?.status === 'finished' || current?.status === 'failed' ? false : 3000;
    },
  });

  const { mutate: start, isPending: isStarting, error: startError } = useMutation({
    mutationFn: () => startScoring(vacancyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoring', 'status', vacancyId] });
    },
  });

  return { status, isStatusLoading, statusError, start, isStarting, startError };
}
