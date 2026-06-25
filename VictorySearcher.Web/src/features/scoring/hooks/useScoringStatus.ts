import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getScoringStatus, startScoring } from '@/api/scoring.api';
import type { ScoringInfo } from '@/types/api';

export function useScoringStatus(vacancyId: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['scoring', 'status', vacancyId],
    queryFn: () => getScoringStatus(vacancyId),
    enabled: !!vacancyId,
    retry: false,
    refetchInterval: (query) => {
      const s = query.state.data?.status;
      return s === 'pending' || s === 'inProcess' ? 3000 : false;
    },
  });

  const { mutate: start, isPending: isStarting } = useMutation({
    mutationFn: () => startScoring(vacancyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoring', 'status', vacancyId] });
      queryClient.invalidateQueries({ queryKey: ['scoring', 'results', vacancyId] });
    },
  });

  const status: ScoringInfo | null = data
    ? { status: data.status, errorMessage: data.errorMessage }
    : null;

  return {
    status,
    isStatusLoading: isLoading,
    statusError: error,
    start,
    isStarting,
  };
}
