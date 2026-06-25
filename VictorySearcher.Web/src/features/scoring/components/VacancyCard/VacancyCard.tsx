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
      type="button"
      className={cn(styles.card, isSelected && styles.active)}
      onClick={onClick}
    >
      <span className={styles.name}>{vacancy.title}</span>
    </button>
  );
}
