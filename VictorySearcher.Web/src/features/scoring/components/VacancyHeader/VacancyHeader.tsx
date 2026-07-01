import type { VacancyDto } from '@/types/api';
import styles from './VacancyHeader.module.css';

interface Props {
  vacancy: VacancyDto;
}

export function VacancyHeader({ vacancy }: Props) {
  return (
    <section className={styles.header}>
      <div className={styles.eyebrowRow}>
        <span className={styles.eyebrow}>Вакансия</span>
        {vacancy.trend && <span className={styles.trend}>{vacancy.trend}</span>}
      </div>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{vacancy.title}</h1>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{vacancy.totalResumes}</div>
            <div className={styles.statLabel}>резюме</div>
          </div>
          <div className={styles.statSep} />
          <div className={styles.stat}>
            <div className={`${styles.statValue} ${styles.statScored}`}>{vacancy.scoredResumes}</div>
            <div className={styles.statLabel}>проверено</div>
          </div>
        </div>
      </div>
    </section>
  );
}
