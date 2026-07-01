import { useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { formatFileSize } from '@/utils/formatters';
import { ACCEPTED_RESUME_FORMATS } from '../../config';
import type { FileEntry } from '../../hooks/useResumeUpload';
import styles from './ResumeUploadDropzone.module.css';

interface Props {
  entries: FileEntry[];
  onUpload: (files: File[]) => void;
  onClear: () => void;
  onRemove: (id: string) => void;
}

const STATUS_TEXT: Record<FileEntry['status'], string> = {
  loading: 'Загрузка…',
  loaded: 'Загружено',
  error: 'Ошибка',
};

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

const RemoveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
  </svg>
);

function fileExt(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts.pop()!.toUpperCase() : 'FILE';
}

export function ResumeUploadDropzone({ entries, onUpload, onClear, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    onUpload(Array.from(fileList));
  }

  return (
    <div className={styles.root}>
      <div
        className={cn(styles.dropzone, dragActive && styles.dropzoneActive)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className={styles.dropIcon}>
          <UploadIcon />
        </div>
        <div className={styles.dropTitle}>Перетащите файлы резюме сюда</div>
        <div className={styles.dropHint}>Поддерживаются форматы DOCX, PDF, TXT</div>
        <button type="button" className={styles.selectBtn} onClick={() => inputRef.current?.click()}>
          Выбрать файлы
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_RESUME_FORMATS.join(',')}
          className={styles.hiddenInput}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {entries.length > 0 && (
        <>
          <div className={styles.stagedHead}>
            <div className={styles.stagedTitle}>Загрузка · {entries.length} файлов</div>
            <button type="button" className={styles.clearBtn} onClick={onClear}>
              Очистить
            </button>
          </div>
          <div className={styles.stagedList}>
            {entries.map((entry) => (
              <div key={entry.id} className={styles.stagedItem}>
                <span className={styles.extBadge}>{fileExt(entry.file.name)}</span>
                <div className={styles.stagedInfo}>
                  <div className={styles.stagedName}>{entry.file.name}</div>
                  <div className={styles.stagedSize}>{formatFileSize(entry.file.size)}</div>
                </div>
                <span
                  className={cn(
                    styles.stagedStatus,
                    entry.status === 'loaded' && styles.statusLoaded,
                    entry.status === 'error' && styles.statusError,
                  )}
                >
                  {entry.status === 'error' ? entry.errorMessage ?? STATUS_TEXT.error : STATUS_TEXT[entry.status]}
                </span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => onRemove(entry.id)}
                  aria-label="Убрать из списка"
                >
                  <RemoveIcon />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
