import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVacancies, createVacancy } from '@/api/vacancies.api';
import type { CreateVacancyRequestDto } from '@/types/api';

export function useVacancies() {
  const queryClient = useQueryClient();

  const { data: vacancies = [], isLoading } = useQuery({
    queryKey: ['vacancies'],
    queryFn: getVacancies,
  });

  const { mutate: create, isPending: isCreating, error: createError } = useMutation({
    mutationFn: (data: CreateVacancyRequestDto) => createVacancy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });

  return { vacancies, isLoading, create, isCreating, createError };
}
