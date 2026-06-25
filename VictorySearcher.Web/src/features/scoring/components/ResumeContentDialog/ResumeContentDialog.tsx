import * as Dialog from '@radix-ui/react-dialog';
import { useResumeContent } from '../../hooks/useResumeContent';
import styles from './ResumeContentDialog.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  vacancyId: string;
  resumeId: string;
  fileName: string;
}

export function ResumeContentDialog({ open, onClose, vacancyId, resumeId, fileName }: Props) {
  const { data, isLoading, error } = useResumeContent(vacancyId, resumeId, open);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>{fileName}</Dialog.Title>
            <Dialog.Close className={styles.closeBtn} aria-label="Закрыть">✕</Dialog.Close>
          </div>
          <div className={styles.body}>
            {isLoading && <div className={styles.skeleton} />}
            {error && <p className={styles.error}>Не удалось загрузить содержание</p>}
            {data && <pre className={styles.pre}>{data.content}</pre>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
