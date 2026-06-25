import { useQuery } from '@tanstack/react-query';
import { getResumeContent } from '@/api/vacancies.api';

export function useResumeContent(vacancyId: string, resumeId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['resume-content', vacancyId, resumeId],
    queryFn: () => getResumeContent(vacancyId, resumeId),
    enabled: enabled && !!resumeId,
    staleTime: 5 * 60 * 1000,
  });
}
