import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVacancies, createVacancy } from '@/api/vacancies.api';
import type { CreateVacancyRequestDto } from '@/types/api';

export function useVacancies() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['vacancies'],
    queryFn: getVacancies,
  });

  const { mutate: create, isPending: isCreating, error: createError } = useMutation({
    mutationFn: (payload: CreateVacancyRequestDto) => createVacancy(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    totalResumes: data?.total_resumes ?? 0,
    isLoading,
    create,
    isCreating,
    createError,
  };
}
