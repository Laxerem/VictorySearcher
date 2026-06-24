import { useEffect } from 'react';
import type { CreateVacancyRequestDto } from '@/types/api';
import { VacancyForm } from '../VacancyForm/VacancyForm';
import styles from './NewVacancyDialog.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVacancyRequestDto) => void;
  isLoading: boolean;
  error?: unknown;
}

export function NewVacancyDialog({ open, onClose, onSubmit, isLoading, error }: Props) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newVacancyTitle"
      >
        <h2 className={styles.title} id="newVacancyTitle">Новая вакансия</h2>
        <VacancyForm
          onSubmit={(data) => { onSubmit(data); onClose(); }}
          onCancel={onClose}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
