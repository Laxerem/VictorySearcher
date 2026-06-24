import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  VacancyList,
  VacancyDetail,
  ResumeUploadPanel,
  ScoringStatusBar,
  NewVacancyDialog,
  useVacancies,
  useVacancy,
  useResumeUpload,
  useScoring,
} from '@/features/scoring';
import type { ApiError } from '@/types/api';
import type { CreateVacancyRequestDto } from '@/types/api';
import styles from './VacancyPage.module.css';

export function VacancyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { vacancies, isLoading: isListLoading, create, isCreating, createError } = useVacancies();
  const { vacancy, isLoading: isDetailLoading } = useVacancy(id!);
  const { entries, upload, clear } = useResumeUpload();
  const { status, isStatusLoading, statusError, start, isStarting } = useScoring(id!);
  const [dialogOpen, setDialogOpen] = useState(false);

  const notStarted = (statusError as ApiError | null)?.status === 404;
  const isActive = status?.status === 'pending' || status?.status === 'inProcess';
  const isFinished = status?.status === 'finished';
  const isFailed = status?.status === 'failed';

  function handleSelectVacancy(selectedId: string) {
    if (selectedId !== id) {
      clear();
      navigate(`/scoring/vacancies/${selectedId}`);
    }
  }

  function handleCreate(data: CreateVacancyRequestDto) {
    create(data, {
      onSuccess: (newVacancy) => {
        setDialogOpen(false);
        navigate(`/scoring/vacancies/${newVacancy.id}`);
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
        {isDetailLoading && <div className={styles.skeleton} />}

        {vacancy && (
          <article className={styles.detail}>
            <VacancyDetail vacancy={vacancy} />

            <div className={styles.divider} />

            {(isStatusLoading) && (
              <div className={styles.statusSkeleton} />
            )}

            {!isStatusLoading && notStarted && (
              <ResumeUploadPanel
                entries={entries}
                onUpload={(files) => upload(id!, files)}
                onStart={() => start()}
                isStarting={isStarting}
              />
            )}

            {!isStatusLoading && (isActive || isFinished || isFailed) && status && (
              <ScoringStatusBar status={status.status} errorMessage={status.errorMessage} />
            )}

            {isFinished && (
              <div className={styles.finishedActions}>
                <span className={styles.finishedNote}>Ранжированный список готов.</span>
                <button
                  type="button"
                  className={styles.resultsBtn}
                  onClick={() => navigate(`/scoring/vacancies/${id}/results`)}
                >
                  Открыть результаты
                </button>
              </div>
            )}

            {isFailed && (
              <button
                type="button"
                className={styles.retryBtn}
                onClick={() => start()}
                disabled={isStarting}
              >
                {isStarting ? 'Запуск…' : 'Запустить повторно'}
              </button>
            )}
          </article>
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
