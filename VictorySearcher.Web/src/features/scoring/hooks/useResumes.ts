import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getResumes } from '@/api/vacancies.api';

export function useResumes(vacancyId: string, page: number, pageSize = 10) {
  return useQuery({
    queryKey: ['resumes', vacancyId, page, pageSize],
    queryFn: () => getResumes(vacancyId, page, pageSize),
    placeholderData: keepPreviousData,
    enabled: !!vacancyId,
  });
}
