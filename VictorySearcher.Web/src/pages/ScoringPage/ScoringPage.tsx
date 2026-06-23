import { useNavigate } from 'react-router-dom';
import { VacancyForm, VacancyList, useVacancies } from '@/features/scoring';
import styles from './ScoringPage.module.css';

export function ScoringPage() {
  const navigate = useNavigate();
  const { vacancies, isLoading, create, isCreating, createError } = useVacancies();

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
          selectedId={null}
          onSelect={(id) => navigate(`/scoring/vacancies/${id}`)}
        />
      </aside>

      <main className={styles.main}>
        <div className={styles.placeholder}>
          Выберите вакансию, чтобы начать работу
        </div>
      </main>
    </div>
  );
}
