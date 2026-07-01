import { useState } from 'react';
import { cn } from '@/utils/cn';
import type { ScoringResultDto } from '@/types/api';
import { SCORE_MAX } from '../../config';
import styles from './CandidateResultCard.module.css';

interface Props {
  result: ScoringResultDto;
  rank: number | null;
  onView: () => void;
  onDownload: () => void;
}

const CaretIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M5 8l7 7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
  </svg>
);

const ViewIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

const CoveredIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
  </svg>
);

const MissedIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
  </svg>
);

function metricClass(value: number, max: number): string {
  const ratio = max > 0 ? value / max : 0;
  if (ratio >= 0.8) return styles.barGreen;
  if (ratio >= 0.55) return styles.barCyan;
  return styles.barMuted;
}

function totalClass(value: number): string {
  if (value >= 85) return styles.totalGreen;
  if (value >= 70) return styles.totalCyan;
  if (value >= 60) return styles.totalBody;
  return styles.totalMuted;
}

function Metric({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={styles.metric}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricTrack}>
        <div className={cn(styles.metricFill, metricClass(value, max))} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CandidateResultCard({ result, rank, onView, onDownload }: Props) {
  const [expanded, setExpanded] = useState(false);
  const extra = result.extraScore ?? 0;

  return (
    <div className={cn(styles.card, rank === 1 && styles.cardTop)}>
      <div className={styles.main}>
        <div className={cn(styles.rank, rank !== null && rank <= 3 && styles.rankTop)}>
          {rank ?? '·'}
        </div>

        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{result.fileName}</span>
            {result.isUncertain && <span className={styles.uncertain}>требует внимания</span>}
          </div>
          <div className={styles.summary}>{result.reasoning}</div>
        </div>

        <div className={styles.scores}>
          <div className={styles.metrics}>
            <Metric label="Опыт" value={result.experienceScore} max={SCORE_MAX.experience} />
            <Metric label="Навыки" value={result.skillsScore} max={SCORE_MAX.skills} />
            <Metric label="Доп." value={extra} max={SCORE_MAX.extra} />
          </div>
          <div className={styles.total}>
            <div className={cn(styles.totalValue, totalClass(result.overallScore))}>{result.overallScore}</div>
            <div className={styles.totalLabel}>из 100</div>
          </div>
        </div>
      </div>

      <div className={styles.actionBar}>
        <button type="button" className={styles.analysisToggle} onClick={() => setExpanded((v) => !v)}>
          <span className={cn(styles.caret, expanded && styles.caretOpen)}>
            <CaretIcon />
          </span>
          Анализ требований
        </button>
        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} onClick={onView}>
            <ViewIcon />
            Резюме
          </button>
          <button type="button" className={styles.actionBtn} onClick={onDownload}>
            <DownloadIcon />
            Скачать
          </button>
        </div>
      </div>

      {expanded && (
        <div className={styles.analysis}>
          <div className={styles.analysisTitle}>Соответствие требованиям</div>
          <div className={styles.analysisList}>
            {result.requirementsAnalysis.map((item, i) => (
              <div key={i} className={styles.analysisRow}>
                <span className={cn(styles.reqIcon, item.covered ? styles.reqCovered : styles.reqMissed)}>
                  {item.covered ? <CoveredIcon /> : <MissedIcon />}
                </span>
                <div>
                  <div className={styles.reqLabel}>{item.requirement}</div>
                  {item.evidence && <div className={styles.reqNote}>{item.evidence}</div>}
                </div>
                <span className={cn(styles.reqVerdict, item.covered ? styles.reqCoveredText : styles.reqMissedText)}>
                  {item.covered ? 'Соответствует' : 'Нет'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
