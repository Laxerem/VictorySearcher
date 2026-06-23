import type { VacancyDto } from '@/types/api';
import { VacancyCard } from '../VacancyCard/VacancyCard';
import styles from './VacancyList.module.css';

interface Props {
  vacancies: VacancyDto[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function VacancyList({ vacancies, isLoading, selectedId, onSelect }: Props) {
  if (isLoading) {
    return (
      <div className={styles.list}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );
  }

  if (vacancies.length === 0) {
    return (
      <div className={styles.empty}>
        Нет вакансий. Создайте первую.
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {vacancies.map((v) => (
        <VacancyCard
          key={v.id}
          vacancy={v}
          isSelected={v.id === selectedId}
          onClick={() => onSelect(v.id)}
        />
      ))}
    </div>
  );
}
