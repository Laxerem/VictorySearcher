import { useNavigate, useParams } from 'react-router-dom';
import {
  VacancyList,
  VacancyDetail,
  ResumeUploadPanel,
  useVacancies,
  useVacancy,
  useResumeUpload,
} from '@/features/scoring';
import styles from './VacancyPage.module.css';

export function VacancyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { vacancies, isLoading: isListLoading } = useVacancies();
  const { vacancy, isLoading: isDetailLoading } = useVacancy(id!);
  const { entries, upload, clear } = useResumeUpload();

  function handleSelectVacancy(selectedId: string) {
    if (selectedId !== id) {
      clear();
      navigate(`/scoring/vacancies/${selectedId}`);
    }
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <VacancyList
          vacancies={vacancies}
          isLoading={isListLoading}
          selectedId={id ?? null}
          onSelect={handleSelectVacancy}
        />
      </aside>

      <main className={styles.main}>
        {isDetailLoading && (
          <div className={styles.skeleton} />
        )}
        {vacancy && (
          <>
            <VacancyDetail vacancy={vacancy} />
            <ResumeUploadPanel
              entries={entries}
              onUpload={(files) => upload(id!, files)}
            />
          </>
        )}
      </main>
    </div>
  );
}
