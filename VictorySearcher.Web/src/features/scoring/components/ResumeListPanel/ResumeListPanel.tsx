import { Pagination } from '@/components/ui/Pagination/Pagination';
import { ResumeListItem } from '../ResumeListItem/ResumeListItem';
import type { PagedResumesDto } from '@/types/api';
import styles from './ResumeListPanel.module.css';

interface Props {
  data: PagedResumesDto | undefined;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  vacancyId: string;
}

export function ResumeListPanel({ data, isLoading, page, onPageChange, vacancyId }: Props) {
  const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0;

  if (isLoading) {
    return (
      <div className={styles.panel}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );
  }

  if (!data || data.totalCount === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>Резюме ещё не загружены</p>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {data.items.map((item) => (
        <ResumeListItem key={item.id} item={item} vacancyId={vacancyId} />
      ))}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
