import { useState } from 'react';
import { VacancyForm, VacancyList, ResumeUploadPanel, useVacancies, useResumeUpload } from '@/features/scoring';
import styles from './ScoringPage.module.css';

export function ScoringPage() {
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);
  const { vacancies, isLoading, create, isCreating, createError } = useVacancies();
  const { entries, upload, clear } = useResumeUpload();

  function handleSelectVacancy(id: string) {
    if (id !== selectedVacancyId) {
      setSelectedVacancyId(id);
      clear();
    }
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <VacancyForm
          onSubmit={create}
          isLoading={isCreating}
          error={createError}
        />
        <VacancyList
          vacancies={vacancies}
          isLoading={isLoading}
          selectedId={selectedVacancyId}
          onSelect={handleSelectVacancy}
        />
      </aside>

      <main className={styles.main}>
        {selectedVacancyId ? (
          <ResumeUploadPanel
            entries={entries}
            onUpload={(files) => upload(selectedVacancyId, files)}
          />
        ) : (
          <div className={styles.placeholder}>
            Выберите вакансию, чтобы загрузить резюме
          </div>
        )}
      </main>
    </div>
  );
}
