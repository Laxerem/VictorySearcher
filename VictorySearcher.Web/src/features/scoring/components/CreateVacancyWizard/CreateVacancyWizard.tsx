import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { cn } from '@/utils/cn';
import type { CreateVacancyRequestDto } from '@/types/api';
import styles from './CreateVacancyWizard.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVacancyRequestDto) => void;
  isLoading: boolean;
  error: unknown;
}

interface FormValues {
  title: string;
  trend: string;
  description: string;
  requirements: string;
  extraRequirements: string;
}

const STEPS = ['Название', 'Описание', 'Требования', 'Доп.'] as const;
const TOTAL = STEPS.length;

/** Fields validated before a given step is allowed to advance. */
const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ['title'],
  2: ['description'],
  3: ['requirements'],
  4: [],
};

function countLines(value: string): number {
  return value.split('\n').filter((line) => line.trim()).length;
}

function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
  </svg>
);

export function CreateVacancyWizard({ open, onClose, onSubmit, isLoading, error }: Props) {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: '', trend: '', description: '', requirements: '', extraRequirements: '' },
  });

  useEffect(() => {
    if (open) {
      setStep(1);
      reset();
    }
  }, [open, reset]);

  const values = watch();

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(TOTAL, s + 1));
  }

  function goBack() {
    if (step === 1) {
      onClose();
      return;
    }
    setStep((s) => s - 1);
  }

  function submit(data: FormValues) {
    onSubmit({
      title: data.title.trim(),
      description: data.description.trim(),
      requirements: data.requirements.trim(),
      extraRequirements: data.extraRequirements.trim() || null,
      trend: data.trend.trim() || null,
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.drawer} aria-describedby={undefined}>
          <form className={styles.form} onSubmit={handleSubmit(submit)}>
            <header className={styles.header}>
              <div className={styles.headerTop}>
                <div>
                  <div className={styles.stepCounter}>Шаг {step} из {TOTAL}</div>
                  <Dialog.Title className={styles.headerTitle}>Новая вакансия</Dialog.Title>
                </div>
                <Dialog.Close type="button" className={styles.closeBtn} aria-label="Закрыть">
                  <CloseIcon />
                </Dialog.Close>
              </div>
              <div className={styles.rail}>
                {STEPS.map((label, i) => {
                  const n = i + 1;
                  const reached = step >= n;
                  return (
                    <button
                      type="button"
                      key={label}
                      className={styles.railStep}
                      onClick={() => n < step && setStep(n)}
                    >
                      <span className={cn(styles.railBar, reached && styles.railBarActive)} />
                      <span className={cn(styles.railLabel, reached && styles.railLabelActive)}>{label}</span>
                    </button>
                  );
                })}
              </div>
            </header>

            <div className={styles.body}>
              {step === 1 && (
                <div className={styles.pane}>
                  <label className={styles.label} htmlFor="title">Название вакансии</label>
                  <p className={styles.hint}>Как должность называется для кандидатов и в отчётах.</p>
                  <input
                    id="title"
                    className={cn(styles.input, errors.title && styles.inputError)}
                    placeholder="Например, Senior C# / .NET разработчик"
                    {...register('title', { required: true })}
                  />

                  <label className={cn(styles.label, styles.labelGap)} htmlFor="trend">
                    Тренд / направление рынка <span className={styles.optional}>— необязательно</span>
                  </label>
                  <p className={styles.hint}>Рыночный контекст роли для аналитики.</p>
                  <input
                    id="trend"
                    className={styles.input}
                    placeholder="Например, Backend / .NET"
                    {...register('trend')}
                  />
                </div>
              )}

              {step === 2 && (
                <div className={styles.pane}>
                  <label className={styles.label} htmlFor="description">Описание</label>
                  <p className={styles.hint}>Чем будет заниматься специалист, контекст команды и продукта.</p>
                  <textarea
                    id="description"
                    className={cn(styles.textarea, errors.description && styles.inputError)}
                    placeholder="Опишите задачи, команду, продукт…"
                    {...register('description', { required: true })}
                  />
                </div>
              )}

              {step === 3 && (
                <div className={styles.pane}>
                  <label className={styles.label} htmlFor="requirements">Требования</label>
                  <p className={styles.hint}>
                    Обязательные навыки и опыт. По ним модель оценивает соответствие — по пункту на строку.
                  </p>
                  <textarea
                    id="requirements"
                    className={cn(styles.textarea, errors.requirements && styles.inputError)}
                    placeholder={'C# / .NET Core от 3 лет\nООП, SOLID, паттерны проектирования\nВысоконагруженные распределённые системы'}
                    {...register('requirements', { required: true })}
                  />
                </div>
              )}

              {step === 4 && (
                <div className={styles.pane}>
                  <label className={styles.label} htmlFor="extraRequirements">
                    Дополнительные требования <span className={styles.optional}>— необязательно</span>
                  </label>
                  <p className={styles.hint}>Желательные, но не критичные пункты. Влияют на отдельный балл «Доп».</p>
                  <textarea
                    id="extraRequirements"
                    className={cn(styles.textarea, styles.textareaShort)}
                    placeholder={'Опыт с ИИ-инструментами (Copilot, Cursor)\nПрофильное образование'}
                    {...register('extraRequirements')}
                  />

                  <div className={styles.summary}>
                    <div className={styles.summaryTitle}>Сводка</div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryKey}>Название</span>
                      <span className={styles.summaryValue}>{values.title.trim() || '—'}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryKey}>Тренд</span>
                      <span className={styles.summaryValue}>{values.trend.trim() || '—'}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryKey}>Описание</span>
                      <span className={styles.summaryValue}>
                        {countWords(values.description) ? `${countWords(values.description)} слов` : '—'}
                      </span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryKey}>Требований</span>
                      <span className={styles.summaryValue}>
                        {countLines(values.requirements) ? `${countLines(values.requirements)} пунктов` : '—'}
                      </span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryKey}>Доп. требований</span>
                      <span className={styles.summaryValue}>
                        {countLines(values.extraRequirements) ? `${countLines(values.extraRequirements)} пунктов` : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!!error && <p className={styles.errorText}>Не удалось создать вакансию. Попробуйте ещё раз.</p>}
            </div>

            <footer className={styles.footer}>
              <button type="button" className={styles.backBtn} onClick={goBack}>
                Назад
              </button>
              {step < TOTAL ? (
                <button type="button" className={styles.primaryBtn} onClick={goNext}>
                  Далее
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.primaryBtn}
                  disabled={isLoading}
                  onClick={handleSubmit(submit)}
                >
                  {isLoading ? 'Создание…' : 'Создать вакансию'}
                </button>
              )}
            </footer>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
