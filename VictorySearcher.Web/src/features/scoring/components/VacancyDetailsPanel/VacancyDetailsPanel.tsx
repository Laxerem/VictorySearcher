import { useState } from 'react';
import { cn } from '@/utils/cn';
import type { VacancyDto } from '@/types/api';
import styles from './VacancyDetailsPanel.module.css';

interface Props {
  vacancy: VacancyDto;
}

function toItems(value: string | null): string[] {
  if (!value) return [];
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const CaretIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M5 8l7 7 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
  </svg>
);

function RequirementList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className={styles.blockTitle}>{title}</div>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i} className={styles.listItem}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function VacancyDetailsPanel({ vacancy }: Props) {
  const [open, setOpen] = useState(true);
  const requirements = toItems(vacancy.requirements);
  const extra = toItems(vacancy.extraRequirements);

  return (
    <div className={styles.panel}>
      <button type="button" className={styles.toggle} onClick={() => setOpen((v) => !v)}>
        <span className={styles.toggleLabel}>
          <ListIcon />
          Описание вакансии
        </span>
        <span className={cn(styles.caret, open && styles.caretOpen)}>
          <CaretIcon />
        </span>
      </button>

      {open && (
        <div className={styles.body}>
          <div className={styles.descBlock}>
            <div className={styles.blockTitle}>Описание</div>
            <p className={styles.desc}>{vacancy.description}</p>
          </div>
          <RequirementList title="Требования" items={requirements} />
          <RequirementList title="Дополнительные требования" items={extra} />
        </div>
      )}
    </div>
  );
}
