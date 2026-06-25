import styles from './ScoringCounter.module.css';

interface Props {
  scoredCount: number;
  totalCount: number;
  unscoredCount: number;
}

export function ScoringCounter({ scoredCount, totalCount, unscoredCount }: Props) {
  if (totalCount === 0) return null;

  return (
    <div className={styles.root}>
      <span className={styles.scored}>
        Проверено: <b className={styles.value}>{scoredCount}</b> из <b className={styles.value}>{totalCount}</b>
      </span>
      {unscoredCount > 0 && (
        <span className={styles.unscored}>К проверке: {unscoredCount} резюме</span>
      )}
    </div>
  );
}
