import styles from './ScoringRunPanel.module.css';

export type ScoringPhase = 'idle' | 'running' | 'done' | 'failed';

interface Props {
  phase: ScoringPhase;
  unscoredCount: number;
  checked: number;
  total: number;
  currentTargetName: string | null;
  isStarting: boolean;
  errorMessage: string | null;
  onStart: () => void;
  onGoToResults: () => void;
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);

export function ScoringRunPanel({
  phase,
  unscoredCount,
  checked,
  total,
  currentTargetName,
  isStarting,
  errorMessage,
  onStart,
  onGoToResults,
}: Props) {
  const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
  const canStart = unscoredCount > 0 && !isStarting;

  return (
    <div className={styles.panel}>
      {phase === 'running' ? (
        <div>
          <div className={styles.runHead}>
            <div className={styles.runTitleRow}>
              <span className={styles.spinner} aria-hidden="true" />
              <span className={styles.runTitle}>Анализируем резюме</span>
            </div>
            <div className={styles.runCount}>
              <span className={styles.runCountDone}>{checked}</span> из {total}
            </div>
          </div>
          <div className={styles.bar}>
            <div className={styles.barFill} style={{ width: `${percent}%` }} />
          </div>
          {currentTargetName && <div className={styles.runCurrent}>Обработка: {currentTargetName}</div>}
        </div>
      ) : phase === 'done' ? (
        <div className={styles.resultRow}>
          <div className={styles.doneInfo}>
            <span className={styles.doneIcon}><CheckIcon /></span>
            <div>
              <div className={styles.doneTitle}>Скоринг завершён</div>
              <div className={styles.doneText}>
                Проанализировано {total} резюме · результаты отранжированы по соответствию.
              </div>
            </div>
          </div>
          <button type="button" className={styles.primaryBtn} onClick={onGoToResults}>
            Перейти к результатам
          </button>
        </div>
      ) : (
        <div className={styles.resultRow}>
          <div>
            <div className={styles.idleTitle}>Запустить скоринг</div>
            <div className={styles.idleText}>
              Модель проанализирует каждое резюме по требованиям вакансии и выставит баллы за опыт,
              навыки и доп. требования.
            </div>
            {phase === 'failed' && errorMessage && <div className={styles.errorText}>{errorMessage}</div>}
            {unscoredCount === 0 && phase !== 'failed' && (
              <div className={styles.idleNote}>Нет непроверенных резюме для анализа.</div>
            )}
          </div>
          <button type="button" className={styles.primaryBtn} onClick={onStart} disabled={!canStart}>
            {isStarting
              ? 'Запуск…'
              : phase === 'failed'
                ? 'Запустить повторно'
                : `Запустить скоринг · ${unscoredCount}`}
          </button>
        </div>
      )}
    </div>
  );
}
