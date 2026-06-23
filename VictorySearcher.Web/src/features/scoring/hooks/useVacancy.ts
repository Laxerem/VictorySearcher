import { useQuery } from '@tanstack/react-query';
import { getVacancy } from '@/api/vacancies.api';

export function useVacancy(id: string) {
  const { data: vacancy, isLoading } = useQuery({
    queryKey: ['vacancies', id],
    queryFn: () => getVacancy(id),
  });
  return { vacancy, isLoading };
}
