import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getScoringResults } from '@/api/scoring.api';
import type { ScoringResultDto } from '@/types/api';

export type ResultsSort = 'total' | 'experience' | 'skills' | 'name';

const sorters: Record<ResultsSort, (a: ScoringResultDto, b: ScoringResultDto) => number> = {
  total: (a, b) => b.overallScore - a.overallScore,
  experience: (a, b) => b.experienceScore - a.experienceScore,
  skills: (a, b) => b.skillsScore - a.skillsScore,
  name: (a, b) => a.fileName.localeCompare(b.fileName, 'ru'),
};

/**
 * Loads scoring results and exposes client-side search (by file name) and sorting.
 * The API already returns results ranked by overall score; this hook layers the
 * view-state (search/sort) on top so components stay presentational.
 */
export function useScoringResultsView(vacancyId: string, enabled: boolean) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ResultsSort>('total');

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['scoring', 'results', vacancyId],
    queryFn: () => getScoringResults(vacancyId),
    enabled,
  });

  const view = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? results.filter((r) => r.fileName.toLowerCase().includes(query))
      : results;
    return [...filtered].sort(sorters[sort]);
  }, [results, search, sort]);

  return {
    results: view,
    totalCount: results.length,
    isLoading,
    search,
    setSearch,
    sort,
    setSort,
    /** Numeric rank is meaningful only in the default ranked order. */
    isRanked: sort === 'total' && search.trim() === '',
  };
}
