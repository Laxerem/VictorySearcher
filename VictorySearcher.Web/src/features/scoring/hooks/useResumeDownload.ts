import { useState } from 'react';
import { downloadResume } from '@/api/vacancies.api';

export function useResumeDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  async function download(vacancyId: string, resumeId: string, fileName: string) {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const blob = await downloadResume(vacancyId, resumeId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  return { download, isDownloading };
}
