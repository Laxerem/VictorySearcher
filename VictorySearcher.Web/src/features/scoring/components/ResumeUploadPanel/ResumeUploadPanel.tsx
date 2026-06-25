import { useRef } from 'react';
import { ACCEPTED_RESUME_FORMATS } from '../../config';
import { FileStatusItem } from '../FileStatusItem/FileStatusItem';
import type { FileEntry } from '../../hooks/useResumeUpload';
import styles from './ResumeUploadPanel.module.css';

interface Props {
  entries: FileEntry[];
  onUpload: (files: File[]) => void;
  onStart: () => void;
  isStarting: boolean;
  disabled?: boolean;
  unscoredCount?: number;
}

export function ResumeUploadPanel({ entries, onUpload, onStart, isStarting, disabled, unscoredCount = 0 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const loadedCount = entries.filter((e) => e.status === 'loaded').length;
  const totalCount = entries.length;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onUpload(files);
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onUpload(files);
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Резюме</h2>

      <div
        className={styles.drop}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={disabled ? undefined : handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click(); }}
        style={disabled ? { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } : undefined}
      >
        <svg className={styles.uploadIcon} viewBox="0 0 24 24">
          <path d="M12 16V4M7 9l5-5 5 5" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        <span className={styles.dropHint}>
          Перетащите резюме или{' '}
          <span className={styles.dropLink}>выберите файлы</span>
        </span>
        <span className={styles.dropSub}>TXT, PDF, DOCX · несколько за раз</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_RESUME_FORMATS.join(',')}
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      {entries.length > 0 && (
        <div className={styles.files}>
          {entries.map((entry) => (
            <FileStatusItem
              key={entry.id}
              filename={entry.file.name}
              status={entry.status}
              loadedAt={entry.loadedAt}
              errorMessage={entry.errorMessage}
            />
          ))}
        </div>
      )}

      <div className={styles.runbar}>
        <span className={styles.note}>
          Готово к скорингу:{' '}
          <b className={styles.noteValue}>{loadedCount}</b> из{' '}
          <b className={styles.noteValue}>{totalCount}</b> файлов
        </span>
        <button
          type="button"
          className={styles.runBtn}
          onClick={onStart}
          disabled={(loadedCount === 0 && unscoredCount === 0) || isStarting || disabled}
        >
          {isStarting ? 'Запуск…' : 'Запустить скоринг'}
        </button>
      </div>
    </section>
  );
}
