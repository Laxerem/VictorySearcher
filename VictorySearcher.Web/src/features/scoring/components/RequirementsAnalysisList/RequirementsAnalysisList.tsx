import type { RequirementCoverageDto } from '@/types/api';
import { cn } from '@/utils/cn';
import styles from './RequirementsAnalysisList.module.css';

interface Props {
  items: RequirementCoverageDto[];
}

export function RequirementsAnalysisList({ items }: Props) {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>Анализ требований ({items.length})</summary>
      <div className={styles.list}>
        {items.map((item, index) => (
          <div className={styles.item} key={index}>
            <div className={styles.itemHead}>
              <span className={cn(styles.dot, item.covered ? styles.dotCovered : styles.dotMissed)} />
              <span className={styles.requirement}>{item.requirement}</span>
            </div>
            {item.evidence && <span className={styles.evidence}>{item.evidence}</span>}
          </div>
        ))}
      </div>
    </details>
  );
}
