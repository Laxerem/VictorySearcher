import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getVacancy } from '@/api/vacancies.api';

export function useVacancy(id: string) {
  const { data: vacancy, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['vacancies', id],
    queryFn: () => getVacancy(id),
    placeholderData: keepPreviousData,
  });
  return { vacancy, isLoading, isPlaceholderData };
}
