import type { VacancyListItemDto } from '@/types/api';
import { VacancyCard } from '../VacancyCard/VacancyCard';
import styles from './VacancyList.module.css';

interface Props {
  vacancies: VacancyListItemDto[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreateClick?: () => void;
}

export function VacancyList({ vacancies, isLoading, selectedId, onSelect, onCreateClick }: Props) {
  return (
    <aside className={styles.panel} aria-label="Список вакансий">
      <div className={styles.head}>
        <span className={styles.title}>Вакансии</span>
        {onCreateClick && (
          <button type="button" className={styles.createBtn} onClick={onCreateClick}>
            + Новая
          </button>
        )}
      </div>

      <div className={styles.scroll}>
        {isLoading && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </>
        )}

        {!isLoading && vacancies.length === 0 && (
          <p className={styles.empty}>Нет вакансий. Создайте первую.</p>
        )}

        {!isLoading && vacancies.map((v) => (
          <VacancyCard
            key={v.id}
            vacancy={v}
            isSelected={v.id === selectedId}
            onClick={() => onSelect(v.id)}
          />
        ))}
      </div>
    </aside>
  );
}
