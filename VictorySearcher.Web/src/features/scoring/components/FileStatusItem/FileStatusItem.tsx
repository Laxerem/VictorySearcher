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
    <div className={styles.file}>
      <svg className={styles.fileIcon} viewBox="0 0 24 24">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
      </svg>
      <span className={styles.fileName}>{filename}</span>
      <span className={styles.chip}>
        {status === 'loading' && (
          <span className={cn(styles.badge, styles.badgeSignal)}>
            <span className={styles.dot} />
            обработка
          </span>
        )}
        {status === 'loaded' && loadedAt && (
          <span className={cn(styles.badge, styles.badgeOk)}>
            ✓ {formatTime(loadedAt)}
          </span>
        )}
        {status === 'error' && (
          <span className={cn(styles.badge, styles.badgeAlert)}>
            {errorMessage}
          </span>
        )}
      </span>
    </div>
  );
}
