import { useQuery } from '@tanstack/react-query';
import { getScoringResults } from '@/api/scoring.api';

export function useScoringResults(vacancyId: string, enabled: boolean) {
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['scoring', 'results', vacancyId],
    queryFn: () => getScoringResults(vacancyId),
    enabled,
  });

  const ranked = results
    .filter((r) => !r.isUncertain)
    .sort((a, b) => b.overallScore - a.overallScore);

  const flagged = results.filter((r) => r.isUncertain);

  return { ranked, flagged, isLoading };
}
