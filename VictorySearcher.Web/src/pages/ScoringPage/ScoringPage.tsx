import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VacancyList, NewVacancyDialog, useVacancies } from '@/features/scoring';
import styles from './ScoringPage.module.css';

export function ScoringPage() {
  const navigate = useNavigate();
  const { vacancies, isLoading, create, isCreating, createError } = useVacancies();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCreate(data: Parameters<typeof create>[0]) {
    create(data, {
      onSuccess: (vacancy) => {
        setDialogOpen(false);
        navigate(`/scoring/vacancies/${vacancy.id}`);
      },
    });
  }

  return (
    <div className={styles.content}>
      <VacancyList
        vacancies={vacancies}
        isLoading={isLoading}
        selectedId={null}
        onSelect={(id) => navigate(`/scoring/vacancies/${id}`)}
        onCreateClick={() => setDialogOpen(true)}
      />

      <main className={styles.main}>
        <div className={styles.empty}>
          Выберите вакансию, чтобы начать работу
        </div>
      </main>

      <NewVacancyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
        error={createError}
      />
    </div>
  );
}
