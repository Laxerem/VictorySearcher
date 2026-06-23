import type { ScoringStatus } from '@/types/api';
import { cn } from '@/utils/cn';
import styles from './ScoringStatusBar.module.css';

interface Props {
  status: ScoringStatus;
  errorMessage?: string | null;
}

const LABELS: Record<ScoringStatus, string> = {
  pending: 'В очереди',
  inProcess: 'Идёт оценка',
  finished: 'Завершено',
  failed: 'Ошибка',
};

export function ScoringStatusBar({ status, errorMessage }: Props) {
  const isActive = status === 'pending' || status === 'inProcess';

  return (
    <div className={cn(styles.bar, styles[status])}>
      <span className={styles.badge}>
        {isActive && <span className={styles.spinner} />}
        {LABELS[status]}
      </span>
      {status === 'failed' && errorMessage && (
        <span className={styles.error}>{errorMessage}</span>
      )}
    </div>
  );
}
