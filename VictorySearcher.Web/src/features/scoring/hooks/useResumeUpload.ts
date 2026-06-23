import { useState } from 'react';
import { uploadResume } from '@/api/vacancies.api';
import { ACCEPTED_RESUME_FORMATS } from '../config';

type FileEntry = {
  id: string;
  file: File;
  status: 'loading' | 'loaded' | 'error';
  loadedAt?: Date;
  errorMessage?: string;
};

export function useResumeUpload() {
  const [entries, setEntries] = useState<FileEntry[]>([]);

  function upload(vacancyId: string, files: File[]) {
    const newEntries: FileEntry[] = files.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      status: 'loading',
    }));

    setEntries((prev) => [...prev, ...newEntries]);

    newEntries.forEach((entry) => {
      const ext = '.' + entry.file.name.split('.').pop()?.toLowerCase();
      const accepted = (ACCEPTED_RESUME_FORMATS as readonly string[]).includes(ext);

      if (!accepted) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? { ...e, status: 'error', errorMessage: 'Неподдерживаемый формат' }
              : e
          )
        );
        return;
      }

      uploadResume(vacancyId, entry.file)
        .then(() => {
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entry.id ? { ...e, status: 'loaded', loadedAt: new Date() } : e
            )
          );
        })
        .catch(() => {
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entry.id
                ? { ...e, status: 'error', errorMessage: 'Ошибка загрузки' }
                : e
            )
          );
        });
    });
  }

  function clear() {
    setEntries([]);
  }

  return { entries, upload, clear };
}
