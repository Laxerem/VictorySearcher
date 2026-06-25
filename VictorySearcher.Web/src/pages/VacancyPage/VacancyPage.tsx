import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/utils/cn';
import {
  VacancyList,
  VacancyDetail,
  ResumeUploadPanel,
  ScoringStatusBar,
  NewVacancyDialog,
  ScoringCounter,
  ResumeListPanel,
  ScoringResultList,
  ScoringProgress,
  useVacancies,
  useVacancy,
  useResumeUpload,
  useScoring,
  useResumes,
  useScoringResults,
} from '@/features/scoring';
import type { ApiError } from '@/types/api';
import type { CreateVacancyRequestDto } from '@/types/api';
import styles from './VacancyPage.module.css';

export function VacancyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { vacancies, isLoading: isListLoading, create, isCreating, createError } = useVacancies();
  const { vacancy, isLoading: isDetailLoading, isPlaceholderData: isVacancyStale } = useVacancy(id!);
  const { entries, upload, clear } = useResumeUpload();
  const { status, isStatusLoading, statusError, start, isStarting, progressEvent } = useScoring(id!);
  const { ranked, flagged, isLoading: isResultsLoading } = useScoringResults(
    id!,
    true,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resumesPage, setResumesPage] = useState(1);
  const { data: resumesData, isLoading: isResumesLoading } = useResumes(id!, resumesPage);

  const apiError = statusError && 'status' in statusError ? (statusError as ApiError) : null;
  const streamError = apiError && apiError.status !== 404;
  const notStarted = apiError?.status === 404;
  const isActive = status?.status === 'pending' || status?.status === 'inProcess';
  const isFailed = status?.status === 'failed';
  const isFinished = status?.status === 'finished';

  const scoredCount = progressEvent?.checked ?? resumesData?.scoredCount ?? 0;
  const totalCount = progressEvent?.total ?? resumesData?.totalCount ?? 0;
  const unscoredCount = resumesData?.unscoredCount ?? 0;

  useEffect(() => {
    if (isFinished && id) {
      queryClient.invalidateQueries({ queryKey: ['resumes', id], exact: false });
      queryClient.invalidateQueries({ queryKey: ['scoring', 'results', id] });
    }
  }, [isFinished, id, queryClient]);

  function handleSelectVacancy(selectedId: string) {
    if (selectedId !== id) {
      clear();
      setResumesPage(1);
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
        {!vacancy && isDetailLoading && <div className={styles.skeleton} />}

        {vacancy && (
          <article className={cn(styles.detail, isVacancyStale && styles.detailFetching)}>
            <VacancyDetail vacancy={vacancy} />

            <div className={styles.divider} />

            <Tabs.Root defaultValue="scoring" className={styles.tabs}>
              <Tabs.List className={styles.tabList}>
                <Tabs.Trigger value="scoring" className={styles.tabTrigger}>
                  Скоринг
                </Tabs.Trigger>
                <Tabs.Trigger value="files" className={styles.tabTrigger}>
                  Файлы резюме
                  {totalCount > 0 && (
                    <span className={styles.tabBadge}>{totalCount}</span>
                  )}
                </Tabs.Trigger>
                <Tabs.Trigger value="results" className={styles.tabTrigger}>
                  Результаты
                  {(ranked.length + flagged.length) > 0 && (
                    <span className={styles.tabBadge}>{ranked.length + flagged.length}</span>
                  )}
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="scoring" className={styles.tabContent}>
                <ScoringCounter
                  scoredCount={scoredCount}
                  totalCount={totalCount}
                  unscoredCount={unscoredCount}
                />

                {isActive && progressEvent && (
                  <ScoringProgress
                    checked={progressEvent.checked}
                    total={progressEvent.total}
                  />
                )}

                {isStatusLoading && !isActive && <div className={styles.statusSkeleton} />}

                {streamError && !isStatusLoading && (
                  <div className={styles.errorPanel}>
                    <p className={styles.errorText}>Ошибка при подключении к стриму скоринга (возможно скоринг уже запущен). Попробуйте позже.</p>
                    <button
                      type="button"
                      className={styles.retryBtn}
                      onClick={() => start()}
                      disabled={isStarting}
                    >
                      Повторить
                    </button>
                  </div>
                )}

                {!isStatusLoading && !isActive && (
                  <ResumeUploadPanel
                    entries={entries}
                    onUpload={(files) => upload(id!, files)}
                    onStart={() => start()}
                    isStarting={isStarting}
                    disabled={isActive}
                    unscoredCount={unscoredCount}
                  />
                )}

                {!isStatusLoading && !notStarted && status && !isActive && (
                  <ScoringStatusBar status={status.status} errorMessage={status.errorMessage} />
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
              </Tabs.Content>

              <Tabs.Content value="files" className={styles.tabContent}>
                <ResumeListPanel
                  data={resumesData}
                  isLoading={isResumesLoading}
                  page={resumesPage}
                  onPageChange={setResumesPage}
                  vacancyId={id!}
                />
              </Tabs.Content>

              <Tabs.Content value="results" className={styles.tabContent}>
                {isResultsLoading && <div className={styles.statusSkeleton} />}
                {!isResultsLoading && (ranked.length + flagged.length) === 0 && (
                  <div className={styles.placeholder}>
                    <p className={styles.placeholderText}>Результаты скоринга не найдены</p>
                  </div>
                )}
                {!isResultsLoading && (ranked.length + flagged.length) > 0 && (
                  <ScoringResultList ranked={ranked} flagged={flagged} />
                )}
              </Tabs.Content>
            </Tabs.Root>
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
