import { useRef } from 'react';
import { ACCEPTED_RESUME_FORMATS } from '../../config';
import { FileStatusItem } from '../FileStatusItem/FileStatusItem';
import styles from './ResumeUploadPanel.module.css';

interface FileEntry {
  id: string;
  file: File;
  status: 'loading' | 'loaded' | 'error';
  loadedAt?: Date;
  errorMessage?: string;
}

interface Props {
  entries: FileEntry[];
  onUpload: (files: File[]) => void;
}

export function ResumeUploadPanel({ entries, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      onUpload(files);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Резюме</h2>
        <button
          type="button"
          className={styles.uploadButton}
          onClick={() => inputRef.current?.click()}
        >
          Загрузить файлы
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_RESUME_FORMATS.join(',')}
          className={styles.hiddenInput}
          onChange={handleChange}
        />
      </div>

      {entries.length === 0 ? (
        <p className={styles.empty}>Выберите файлы резюме для загрузки</p>
      ) : (
        <div className={styles.list}>
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
    </div>
  );
}
