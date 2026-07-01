import { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { formatFileSize } from '@/utils/formatters';
import type { PagedResumesDto } from '@/types/api';
import { useResumeDownload } from '../../hooks/useResumeDownload';
import { ResumeContentDialog } from '../ResumeContentDialog/ResumeContentDialog';
import styles from './ResumeFilesTable.module.css';

interface Props {
  data: PagedResumesDto | undefined;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  vacancyId: string;
}

type StatusFilter = 'all' | 'uploaded' | 'checked';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
    <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
);

const ViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

export function ResumeFilesTable({ data, isLoading, page, onPageChange, vacancyId }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [viewing, setViewing] = useState<{ id: string; fileName: string } | null>(null);
  const { download } = useResumeDownload();

  const items = useMemo(() => data?.items ?? [], [data]);
  const pageSize = data?.pageSize ?? 10;
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      if (filter === 'uploaded' && item.isScored) return false;
      if (filter === 'checked' && !item.isScored) return false;
      if (query && !item.fileName.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [items, search, filter]);

  const chips: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: 'Все', count: items.length },
    { key: 'uploaded', label: 'Загружен', count: items.filter((i) => !i.isScored).length },
    { key: 'checked', label: 'Проверен', count: items.filter((i) => i.isScored).length },
  ];

  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = (page - 1) * pageSize + items.length;

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><SearchIcon /></span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Поиск по имени файла (на текущей странице)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.chips}>
          {chips.map((chip) => (
            <button
              type="button"
              key={chip.key}
              className={cn(styles.chip, filter === chip.key && styles.chipActive)}
              onClick={() => setFilter(chip.key)}
            >
              {chip.label}
              <span className={styles.chipCount}>{chip.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.headRow}>
          <div>Файл</div>
          <div>Размер</div>
          <div>Статус</div>
          <div className={styles.headActions}>Действия</div>
        </div>

        {isLoading && <div className={styles.stateRow}>Загрузка…</div>}

        {!isLoading && visible.map((item) => (
          <div key={item.id} className={styles.row}>
            <div className={styles.fileCell}>
              <span className={styles.extBadge}>{item.format}</span>
              <span className={styles.fileName}>{item.fileName}</span>
            </div>
            <div className={styles.sizeCell}>{formatFileSize(item.fileSizeBytes)}</div>
            <div>
              <span className={cn(styles.status, item.isScored ? styles.statusChecked : styles.statusUploaded)}>
                <span className={styles.statusDot} />
                {item.isScored ? 'Проверен' : 'Загружен'}
              </span>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconBtn}
                title="Просмотреть"
                onClick={() => setViewing({ id: item.id, fileName: item.fileName })}
              >
                <ViewIcon />
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                title="Скачать"
                onClick={() => download(vacancyId, item.id, item.fileName)}
              >
                <DownloadIcon />
              </button>
            </div>
          </div>
        ))}

        {!isLoading && visible.length === 0 && (
          <div className={styles.stateRow}>Файлы не найдены</div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.range}>
          {totalCount > 0 ? `${rangeStart}–${rangeEnd} из ${totalCount}` : '0 из 0'}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>

      {viewing && (
        <ResumeContentDialog
          open={!!viewing}
          onClose={() => setViewing(null)}
          vacancyId={vacancyId}
          resumeId={viewing.id}
          fileName={viewing.fileName}
        />
      )}
    </div>
  );
}
