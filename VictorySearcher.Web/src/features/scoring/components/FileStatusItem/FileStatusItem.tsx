import { formatTime } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import styles from './FileStatusItem.module.css';

interface Props {
  filename: string;
  status: 'loading' | 'loaded' | 'error';
  loadedAt?: Date;
  errorMessage?: string;
}

export function FileStatusItem({ filename, status, loadedAt, errorMessage }: Props) {
  return (
    <div className={cn(styles.item, styles[status])}>
      <span className={styles.name}>{filename}</span>
      <span className={styles.status}>
        {status === 'loading' && <span className={styles.spinner} />}
        {status === 'loaded' && loadedAt && (
          <span className={styles.loadedText}>✓ {formatTime(loadedAt)}</span>
        )}
        {status === 'error' && (
          <span className={styles.errorText}>{errorMessage}</span>
        )}
      </span>
    </div>
  );
}
