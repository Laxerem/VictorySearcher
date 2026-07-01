import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { AppLayout } from '@/components/layout/AppLayout/AppLayout';
import {
  VacancyHeader,
  VacancyDetailsPanel,
  ResumeUploadDropzone,
  ScoringRunPanel,
  ResumeFilesTable,
  ScoringResultsPanel,
  useVacancy,
  useResumeUpload,
  useScoring,
  useResumes,
} from '@/features/scoring';
import type { ScoringPhase } from '@/features/scoring';
import styles from './VacancyPage.module.css';

export function VacancyPage() {
  const { id } = useParams<{ id: string }>();
  const vacancyId = id!;
  const queryClient = useQueryClient();

  const [tab, setTab] = useState('scoring');
  const [resumesPage, setResumesPage] = useState(1);

  const { vacancy, isLoading: isVacancyLoading } = useVacancy(vacancyId);
  const { entries, upload, clear, remove } = useResumeUpload();
  const { status, start, isStarting, progressEvent } = useScoring(vacancyId);
  const { data: resumesData, isLoading: isResumesLoading } = useResumes(vacancyId, resumesPage);

  const isActive = status?.status === 'pending' || status?.status === 'inProcess';
  const isFinished = status?.status === 'finished';
  const isFailed = status?.status === 'failed';

  const scoredResumes = resumesData?.scoredCount ?? vacancy?.scoredResumes ?? 0;
  const totalResumes = resumesData?.totalCount ?? vacancy?.totalResumes ?? 0;
  const unscoredCount = resumesData?.unscoredCount ?? vacancy?.unscoredResumes ?? 0;

  // Prioritise actionable states: if there are still unscored resumes the user
  // should be able to (re)run scoring rather than see a stale "done" panel.
  let phase: ScoringPhase;
  if (isActive) phase = 'running';
  else if (isFailed) phase = 'failed';
  else if (unscoredCount > 0) phase = 'idle';
  else if (isFinished || scoredResumes > 0) phase = 'done';
  else phase = 'idle';

  const checked = progressEvent?.checked ?? scoredResumes;
  const total = progressEvent?.total ?? totalResumes;

  useEffect(() => {
    if (isFinished) {
      queryClient.invalidateQueries({ queryKey: ['resumes', vacancyId], exact: false });
      queryClient.invalidateQueries({ queryKey: ['scoring', 'results', vacancyId] });
      queryClient.invalidateQueries({ queryKey: ['vacancies', vacancyId] });
    }
  }, [isFinished, vacancyId, queryClient]);

  const breadcrumb = (
    <>
      <Link to="/scoring" className={styles.crumbLink}>Вакансии</Link>
      <span className={styles.crumbSep}>/</span>
      <span className={styles.crumbCurrent}>{vacancy?.title ?? '…'}</span>
    </>
  );

  return (
    <AppLayout breadcrumb={breadcrumb}>
      <div className={styles.page}>
        {!vacancy && isVacancyLoading && <div className={styles.skeleton} />}

        {vacancy && (
          <>
            <VacancyHeader vacancy={vacancy} />
            <VacancyDetailsPanel vacancy={vacancy} />

            <Tabs.Root value={tab} onValueChange={setTab} className={styles.tabs}>
              <Tabs.List className={styles.tabList}>
                <Tabs.Trigger value="scoring" className={styles.tab}>
                  Скоринг резюме
                </Tabs.Trigger>
                <Tabs.Trigger value="files" className={styles.tab}>
                  Файлы резюме
                  {totalResumes > 0 && <span className={styles.tabBadge}>{totalResumes}</span>}
                </Tabs.Trigger>
                <Tabs.Trigger value="results" className={styles.tab}>
                  Результаты
                  {scoredResumes > 0 && <span className={styles.tabBadge}>{scoredResumes}</span>}
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="scoring" className={styles.tabContent}>
                <ResumeUploadDropzone
                  entries={entries}
                  onUpload={(files) => upload(vacancyId, files)}
                  onClear={clear}
                  onRemove={remove}
                />
                <ScoringRunPanel
                  phase={phase}
                  unscoredCount={unscoredCount}
                  checked={checked}
                  total={total}
                  currentTargetName={progressEvent?.currentTargetName ?? null}
                  isStarting={isStarting}
                  errorMessage={status?.errorMessage ?? null}
                  onStart={() => start()}
                  onGoToResults={() => setTab('results')}
                />
              </Tabs.Content>

              <Tabs.Content value="files" className={styles.tabContent}>
                <ResumeFilesTable
                  data={resumesData}
                  isLoading={isResumesLoading}
                  page={resumesPage}
                  onPageChange={setResumesPage}
                  vacancyId={vacancyId}
                />
              </Tabs.Content>

              <Tabs.Content value="results" className={styles.tabContent}>
                {scoredResumes > 0 ? (
                  <ScoringResultsPanel vacancyId={vacancyId} enabled={tab === 'results'} />
                ) : (
                  <div className={styles.placeholder}>
                    Результаты появятся после завершения скоринга.
                  </div>
                )}
              </Tabs.Content>
            </Tabs.Root>
          </>
        )}
      </div>
    </AppLayout>
  );
}
