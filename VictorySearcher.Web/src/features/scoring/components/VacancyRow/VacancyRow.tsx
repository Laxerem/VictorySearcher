import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import type { VacancyListItemDto } from '@/types/api';
import styles from './VacancyRow.module.css';

interface Props {
  vacancy: VacancyListItemDto;
}

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
  </svg>
);

function scoreClass(score: number): string {
  if (score >= 90) return styles.scoreGreen;
  if (score >= 80) return styles.scoreCyan;
  return styles.scoreBody;
}

export function VacancyRow({ vacancy }: Props) {
  const scored = vacancy.checked_resume_count > 0;

  return (
    <Link to={`/scoring/vacancies/${vacancy.id}`} className={styles.row}>
      <div className={styles.info}>
        <span className={styles.title}>{vacancy.title}</span>
        {vacancy.trend && (
          <div className={styles.meta}>
            <span>{vacancy.trend}</span>
          </div>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{vacancy.resume_count}</div>
          <div className={styles.statLabel}>резюме</div>
        </div>
        <div className={styles.stat}>
          <div className={cn(styles.statValue, styles.statScored)}>{vacancy.checked_resume_count}</div>
          <div className={styles.statLabel}>проверено</div>
        </div>
        <div className={cn(styles.stat, styles.statTop)}>
          <div className={cn(styles.topScore, scored ? scoreClass(vacancy.best_score) : styles.scoreFaint)}>
            {scored ? vacancy.best_score : '—'}
          </div>
          <div className={styles.statLabel}>топ-балл</div>
        </div>
      </div>

      <span className={styles.chevron}>
        <ChevronIcon />
      </span>
    </Link>
  );
}
