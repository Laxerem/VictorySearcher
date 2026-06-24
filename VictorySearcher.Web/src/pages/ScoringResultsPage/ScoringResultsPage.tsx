import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  VacancyList,
  ScoringStatusBar,
  ScoringResultList,
  NewVacancyDialog,
  useVacancies,
  useScoring,
  useScoringResults,
} from '@/features/scoring';
import type { ApiError } from '@/types/api';
import type { CreateVacancyRequestDto } from '@/types/api';
import styles from './ScoringResultsPage.module.css';

export function ScoringResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { vacancies, isLoading: isListLoading, create, isCreating, createError } = useVacancies();
  const { status, isStatusLoading, statusError, start, isStarting } = useScoring(id!);
  const { ranked, flagged, isLoading: isResultsLoading } = useScoringResults(
    id!,
    status?.status === 'finished',
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const notStarted = (statusError as ApiError | null)?.status === 404;

  function handleSelectVacancy(selectedId: string) {
    if (selectedId !== id) {
      navigate(`/scoring/vacancies/${selectedId}/results`);
    }
  }

  function handleCreate(data: CreateVacancyRequestDto) {
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
        isLoading={isListLoading}
        selectedId={id ?? null}
        onSelect={handleSelectVacancy}
        onCreateClick={() => setDialogOpen(true)}
      />

      <main className={styles.main}>
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(`/scoring/vacancies/${id}`)}
          >
            ← К вакансии
          </button>
        </div>

        {isStatusLoading && <div className={styles.skeleton} />}

        {!isStatusLoading && notStarted && (
          <div className={styles.placeholder}>
            <p className={styles.placeholderText}>Скоринг ещё не запускался</p>
            <button
              type="button"
              className={styles.startBtn}
              onClick={() => start()}
              disabled={isStarting}
            >
              {isStarting ? 'Запуск…' : 'Запустить скоринг'}
            </button>
          </div>
        )}

        {status && (
          <>
            <ScoringStatusBar status={status.status} errorMessage={status.errorMessage} />

            {status.status === 'failed' && (
              <button
                type="button"
                className={styles.startBtn}
                onClick={() => start()}
                disabled={isStarting}
              >
                {isStarting ? 'Запуск…' : 'Запустить повторно'}
              </button>
            )}

            {status.status === 'finished' && (
              isResultsLoading
                ? <div className={styles.skeleton} />
                : <ScoringResultList ranked={ranked} flagged={flagged} />
            )}
          </>
        )}
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
