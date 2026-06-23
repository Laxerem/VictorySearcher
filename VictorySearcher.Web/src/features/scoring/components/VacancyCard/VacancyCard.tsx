import { cn } from '@/utils/cn';
import type { VacancyDto } from '@/types/api';
import styles from './VacancyCard.module.css';

interface Props {
  vacancy: VacancyDto;
  isSelected: boolean;
  onClick: () => void;
}

export function VacancyCard({ vacancy, isSelected, onClick }: Props) {
  const date = new Date(vacancy.createdAt).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <button
      className={cn(styles.card, isSelected && styles.selected)}
      onClick={onClick}
      type="button"
    >
      <span className={styles.title}>{vacancy.title}</span>
      <span className={styles.date}>{date}</span>
    </button>
  );
}
