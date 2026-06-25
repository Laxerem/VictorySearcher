import styles from './ScoringProgress.module.css';

interface Props {
  checked: number;
  total: number;
}

export function ScoringProgress({ checked, total }: Props) {
  const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.label}>Проверка резюме</span>
        <span className={styles.counter}>
          <span className={styles.checked}>{checked}</span>
          <span className={styles.slash}>/</span>
          <span className={styles.total}>{total}</span>
        </span>
      </div>
      <div className={styles.barContainer}>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={styles.percent}>{percent}%</span>
      </div>
    </div>
  );
}
