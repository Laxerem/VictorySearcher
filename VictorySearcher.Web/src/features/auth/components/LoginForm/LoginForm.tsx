import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { useLogin } from '../../hooks/useLogin';
import styles from './LoginForm.module.css';

interface FormValues {
  login: string;
  password: string;
  remember: boolean;
}

export function LoginForm() {
  const { submit, isLoading, error } = useLogin();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { remember: true },
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((data) => submit(data))}
      noValidate
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="login">
          Логин
        </label>
        <input
          id="login"
          type="text"
          className={styles.input}
          placeholder="Введите логин"
          autoComplete="username"
          {...register('login', { required: true })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Пароль
        </label>
        <div className={styles.passwordField}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className={cn(styles.input, styles.passwordInput)}
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password', { required: true })}
          />
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShowPassword((v) => !v)}
            aria-pressed={showPassword}
          >
            {showPassword ? 'Скрыть' : 'Показать'}
          </button>
        </div>
      </div>

      <label className={styles.remember}>
        <input
          type="checkbox"
          className={styles.checkboxInput}
          {...register('remember')}
        />
        <span className={styles.checkboxBox} aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 7L5 10L11 3" stroke="var(--text-on-light)" strokeWidth="2" strokeLinecap="square" />
          </svg>
        </span>
        <span className={styles.checkboxLabel}>Запомнить меня на этом устройстве</span>
      </label>

      {error && <p className={styles.errorText}>{error}</p>}

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
}
