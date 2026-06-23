import { useForm } from 'react-hook-form';
import { cn } from '@/utils/cn';
import type { CreateVacancyRequestDto } from '@/types/api';
import styles from './VacancyForm.module.css';

interface Props {
  onSubmit: (data: CreateVacancyRequestDto) => void;
  isLoading: boolean;
  error?: unknown;
}

export function VacancyForm({ onSubmit, isLoading, error }: Props) {
  const { register, handleSubmit, reset } = useForm<CreateVacancyRequestDto>();

  function handleValid(data: CreateVacancyRequestDto) {
    onSubmit(data);
    reset();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleValid)} noValidate>
      <h2 className={styles.title}>Новая вакансия</h2>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">Название</label>
        <input
          id="title"
          className={styles.input}
          placeholder="Senior Frontend Developer"
          {...register('title', { required: true })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="description">Описание</label>
        <textarea
          id="description"
          className={cn(styles.input, styles.textarea)}
          rows={3}
          placeholder="О вакансии..."
          {...register('description', { required: true })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="requirements">Требования</label>
        <textarea
          id="requirements"
          className={cn(styles.input, styles.textarea)}
          rows={3}
          placeholder="Обязательные требования..."
          {...register('requirements', { required: true })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="extraRequirements">
          Дополнительные требования
          <span className={styles.optional}> (необязательно)</span>
        </label>
        <textarea
          id="extraRequirements"
          className={cn(styles.input, styles.textarea)}
          rows={2}
          placeholder="Желательные навыки..."
          {...register('extraRequirements')}
        />
      </div>

      {!!error && (
        <p className={styles.errorText}>Ошибка при создании вакансии</p>
      )}

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Создание...' : 'Создать вакансию'}
      </button>
    </form>
  );
}
