import { useState } from 'react';
import { cn } from '@/utils/cn';
import { useResumeDownload } from '../../hooks/useResumeDownload';
import { ResumeContentDialog } from '../ResumeContentDialog/ResumeContentDialog';
import type { ResumeListItemDto } from '@/types/api';
import styles from './ResumeListItem.module.css';

interface Props {
  item: ResumeListItemDto;
  vacancyId: string;
}

export function ResumeListItem({ item, vacancyId }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { download, isDownloading } = useResumeDownload();

  const date = new Date(item.loadedAt).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <>
      <div className={styles.item}>
        <span className={styles.format}>{item.format}</span>
        <span className={styles.fileName}>{item.fileName}</span>
        <span className={styles.date}>{date}</span>
        <span className={cn(styles.badge, item.isScored ? styles.badgeScored : styles.badgeLoaded)}>
          {item.isScored ? 'Проверен' : 'Загружен'}
        </span>
        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} onClick={() => setDialogOpen(true)}>
            Просмотр
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => download(vacancyId, item.id, item.fileName)}
            disabled={isDownloading}
          >
            {isDownloading ? '…' : 'Скачать'}
          </button>
        </div>
      </div>

      <ResumeContentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        vacancyId={vacancyId}
        resumeId={item.id}
        fileName={item.fileName}
      />
    </>
  );
}
