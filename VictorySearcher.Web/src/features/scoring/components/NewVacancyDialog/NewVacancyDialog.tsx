import * as Dialog from '@radix-ui/react-dialog';
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
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>Новая вакансия</Dialog.Title>
          <VacancyForm
            onSubmit={(data) => { onSubmit(data); onClose(); }}
            onCancel={onClose}
            isLoading={isLoading}
            error={error}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
