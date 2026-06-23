import { cn } from '@/utils/cn';
import type { VacancyListItemDto } from '@/types/api';
import styles from './VacancyCard.module.css';

interface Props {
  vacancy: VacancyListItemDto;
  isSelected: boolean;
  onClick: () => void;
}

export function VacancyCard({ vacancy, isSelected, onClick }: Props) {
  return (
    <button
      className={cn(styles.card, isSelected && styles.selected)}
      onClick={onClick}
      type="button"
    >
      <span className={styles.title}>{vacancy.title}</span>
    </button>
  );
}
