import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVacancies } from './useVacancies';
import type { CreateVacancyRequestDto } from '@/types/api';

export function useVacancyCreate() {
  const navigate = useNavigate();
  const { create, isCreating, createError } = useVacancies();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCreate(data: CreateVacancyRequestDto) {
    create(data, {
      onSuccess: (vacancy) => {
        setDialogOpen(false);
        navigate(`/scoring/vacancies/${vacancy.id}`);
      },
    });
  }

  return {
    dialogOpen,
    openDialog: () => setDialogOpen(true),
    closeDialog: () => setDialogOpen(false),
    handleCreate,
    isCreating,
    createError,
  };
}
