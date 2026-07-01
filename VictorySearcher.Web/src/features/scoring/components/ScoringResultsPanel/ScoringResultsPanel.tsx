import { useState } from 'react';
import { cn } from '@/utils/cn';
import { useScoringResultsView, type ResultsSort } from '../../hooks/useScoringResultsView';
import { useResumeDownload } from '../../hooks/useResumeDownload';
import { CandidateResultCard } from '../CandidateResultCard/CandidateResultCard';
import { ResumeContentDialog } from '../ResumeContentDialog/ResumeContentDialog';
import styles from './ScoringResultsPanel.module.css';

interface Props {
  vacancyId: string;
  enabled: boolean;
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
    <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
);

const SORT_OPTIONS: { key: ResultsSort; label: string }[] = [
  { key: 'total', label: 'Балл' },
  { key: 'experience', label: 'Опыт' },
  { key: 'skills', label: 'Навыки' },
  { key: 'name', label: 'Имя' },
];

export function ScoringResultsPanel({ vacancyId, enabled }: Props) {
  const { results, isLoading, search, setSearch, sort, setSort, isRanked } = useScoringResultsView(
    vacancyId,
    enabled,
  );
  const { download } = useResumeDownload();
  const [viewing, setViewing] = useState<{ id: string; fileName: string } | null>(null);

  if (isLoading) {
    return <div className={styles.state}>Загрузка результатов…</div>;
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><SearchIcon /></span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Поиск кандидата"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.sort}>
          <span className={styles.sortLabel}>Сортировка</span>
          <div className={styles.sortGroup}>
            {SORT_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.key}
                className={cn(styles.sortBtn, sort === option.key && styles.sortBtnActive)}
                onClick={() => setSort(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {results.map((result, index) => (
          <CandidateResultCard
            key={result.resumeId}
            result={result}
            rank={isRanked ? index + 1 : null}
            onView={() => setViewing({ id: result.resumeId, fileName: result.fileName })}
            onDownload={() => download(vacancyId, result.resumeId, result.fileName)}
          />
        ))}
        {results.length === 0 && <div className={styles.empty}>Кандидаты не найдены</div>}
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
