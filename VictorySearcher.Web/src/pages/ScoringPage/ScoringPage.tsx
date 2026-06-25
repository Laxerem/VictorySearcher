import { useNavigate } from 'react-router-dom';
import { VacancyList, NewVacancyDialog, useVacancyCreate } from '@/features/scoring';
import styles from './ScoringPage.module.css';

export function ScoringPage() {
  const navigate = useNavigate();
  const {
    vacancies,
    isLoading,
    dialogOpen,
    openDialog,
    closeDialog,
    handleCreate,
    isCreating,
    createError,
  } = useVacancyCreate();

  return (
    <div className={styles.content}>
      <VacancyList
        vacancies={vacancies}
        isLoading={isLoading}
        selectedId={null}
        onSelect={(id) => navigate(`/scoring/vacancies/${id}`)}
        onCreateClick={openDialog}
      />

      <main className={styles.main}>
        <div className={styles.empty}>
          Выберите вакансию, чтобы начать работу
        </div>
      </main>

      <NewVacancyDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
        error={createError}
      />
    </div>
  );
}
