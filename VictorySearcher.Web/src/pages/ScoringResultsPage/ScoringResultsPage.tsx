import { useNavigate, useParams } from 'react-router-dom';
import {
  VacancyList,
  ScoringStatusBar,
  ScoringResultList,
  NewVacancyDialog,
  useScoringStatus,
  useScoringResults,
  useVacancyCreate,
} from '@/features/scoring';
import type { ApiError } from '@/types/api';
import styles from './ScoringResultsPage.module.css';

export function ScoringResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    vacancies,
    isLoading: isListLoading,
    dialogOpen,
    openDialog,
    closeDialog,
    handleCreate,
    isCreating,
    createError,
  } = useVacancyCreate();

  const { status, isStatusLoading, statusError, start, isStarting } = useScoringStatus(id!);
  const { ranked, flagged, isLoading: isResultsLoading } = useScoringResults(
    id!,
    status?.status === 'finished',
  );

  const notStarted = (statusError as ApiError | null)?.status === 404;

  function handleSelectVacancy(selectedId: string) {
    if (selectedId !== id) {
      navigate(`/scoring/vacancies/${selectedId}/results`);
    }
  }

  return (
    <div className={styles.content}>
      <VacancyList
        vacancies={vacancies}
        isLoading={isListLoading}
        selectedId={id ?? null}
        onSelect={handleSelectVacancy}
        onCreateClick={openDialog}
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
        onClose={closeDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
        error={createError}
      />
    </div>
  );
}
