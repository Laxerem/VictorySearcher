import type { ScoringStatus } from '@/types/api';
import { cn } from '@/utils/cn';
import styles from './ScoringStatusBar.module.css';

interface Props {
  status: ScoringStatus;
  errorMessage?: string | null;
}

export function ScoringStatusBar({ status, errorMessage }: Props) {
  const isActive = status === 'pending' || status === 'inProcess';
  const isFinished = status === 'finished';
  const isFailed = status === 'failed';

  return (
    <div className={cn(styles.bar, isFinished && styles.barOk, isFailed && styles.barAlert)}>
      <div className={styles.row}>
        <span className={styles.label}>
          {isActive && <span className={styles.dot} />}
          {isActive && 'Идёт скоринг резюме'}
          {isFinished && 'Скоринг завершён'}
          {isFailed && 'Ошибка скоринга'}
        </span>
      </div>

      {isActive && (
        <div className={styles.progress}>
          <div className={styles.progressFill} />
        </div>
      )}

      {isActive && (
        <span className={styles.note}>
          Процесс идёт в фоне — можно переключиться на другую вакансию.
        </span>
      )}

      {isFailed && errorMessage && (
        <span className={styles.errorText}>{errorMessage}</span>
      )}
    </div>
  );
}
