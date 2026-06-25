import { useForm } from 'react-hook-form';
import { cn } from '@/utils/cn';
import type { CreateVacancyRequestDto } from '@/types/api';
import styles from './VacancyForm.module.css';

interface Props {
  onSubmit: (data: CreateVacancyRequestDto) => void;
  onCancel: () => void;
  isLoading: boolean;
  error?: unknown;
}

export function VacancyForm({ onSubmit, onCancel, isLoading, error }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateVacancyRequestDto>();

  function handleValid(data: CreateVacancyRequestDto) {
    onSubmit(data);
    reset();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleValid)} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="vf-title">Название</label>
        <input
          id="vf-title"
          className={cn(styles.input, errors.title && styles.inputInvalid)}
          placeholder="Senior Frontend Developer"
          {...register('title', { required: 'Обязательное поле' })}
        />
        {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="vf-description">Описание</label>
        <textarea
          id="vf-description"
          className={cn(styles.textarea, errors.description && styles.inputInvalid)}
          rows={3}
          placeholder="О вакансии…"
          {...register('description', { required: 'Обязательное поле' })}
        />
        {errors.description && <span className={styles.fieldError}>{errors.description.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="vf-requirements">Требования</label>
        <textarea
          id="vf-requirements"
          className={cn(styles.textarea, errors.requirements && styles.inputInvalid)}
          rows={3}
          placeholder="Обязательные требования…"
          {...register('requirements', { required: 'Обязательное поле' })}
        />
        {errors.requirements && <span className={styles.fieldError}>{errors.requirements.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="vf-extra">
          Дополнительные требования{' '}
          <span className={styles.optional}>(необязательно)</span>
        </label>
        <textarea
          id="vf-extra"
          className={styles.textarea}
          rows={2}
          placeholder="Желательные навыки…"
          {...register('extraRequirements')}
        />
      </div>

      {!!error && (
        <p className={styles.errorText}>Ошибка при создании вакансии</p>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Создание…' : 'Создать вакансию'}
        </button>
      </div>
    </form>
  );
}
