import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

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
          queryClient.invalidateQueries({ queryKey: ['resumes', vacancyId], exact: false });
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
