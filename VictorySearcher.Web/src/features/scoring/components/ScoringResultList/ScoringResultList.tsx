import type { ScoringResultDto } from '@/types/api';
import { ScoredResumeCard } from '../ScoredResumeCard/ScoredResumeCard';
import styles from './ScoringResultList.module.css';

interface Props {
  ranked: ScoringResultDto[];
  flagged: ScoringResultDto[];
}

export function ScoringResultList({ ranked, flagged }: Props) {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Кандидаты</h2>
        {ranked.length === 0 ? (
          <p className={styles.empty}>Нет подходящих кандидатов</p>
        ) : (
          <div className={styles.list}>
            {ranked.map((result, index) => (
              <ScoredResumeCard key={result.resumeId} result={result} rank={index + 1} />
            ))}
          </div>
        )}
      </section>

      {flagged.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitleUncertain}>Неопределённо</h2>
          <div className={styles.list}>
            {flagged.map((result) => (
              <ScoredResumeCard key={result.resumeId} result={result} flagged />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
