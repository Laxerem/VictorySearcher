import type { ScoringResultDto } from '@/types/api';
import { cn } from '@/utils/cn';
import { RequirementsAnalysisList } from '../RequirementsAnalysisList/RequirementsAnalysisList';
import styles from './ScoredResumeCard.module.css';

interface Props {
  result: ScoringResultDto;
  rank?: number;
  flagged?: boolean;
}

interface MetricProps {
  label: string;
  value: number | null;
  max: number;
}

function Metric({ label, value, max }: MetricProps) {
  const percent = value === null ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div className={styles.metric}>
      <div className={styles.metricHead}>
        <span className={styles.metricLabel}>{label}</span>
        <span className={styles.metricValue}>{value === null ? '—' : `${value} / ${max}`}</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function ScoredResumeCard({ result, rank, flagged }: Props) {
  return (
    <div className={cn(styles.card, flagged && styles.flagged)}>
      <div className={styles.header}>
        <div className={styles.identity}>
          {rank !== undefined && <span className={styles.rank}>#{rank}</span>}
          <span className={styles.fileName}>{result.fileName}</span>
          {result.isUncertain && (
            <span className={styles.uncertainBadge}>? Неопределённо</span>
          )}
        </div>
        <div className={styles.overall}>
          <span className={styles.overallValue}>{result.overallScore}</span>
          <span className={styles.overallMax}>/ 100</span>
        </div>
      </div>

      <div className={styles.metrics}>
        <Metric label="Опыт" value={result.experienceScore} max={50} />
        <Metric label="Навыки" value={result.skillsScore} max={40} />
        <Metric label="Доп. требования" value={result.extraScore} max={10} />
      </div>

      <p className={styles.reasoning}>{result.reasoning}</p>

      {result.requirementsAnalysis.length > 0 && (
        <RequirementsAnalysisList items={result.requirementsAnalysis} />
      )}
    </div>
  );
}
