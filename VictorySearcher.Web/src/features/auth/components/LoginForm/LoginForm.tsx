import { useForm } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { useLogin } from '../../hooks/useLogin';
import styles from './LoginForm.module.css';

interface FormValues {
  login: string;
  password: string;
}

export function LoginForm() {
  const { submit, isLoading, error } = useLogin();
  const { register, handleSubmit } = useForm<FormValues>();

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
          placeholder="recruiter"
          autoComplete="username"
          {...register('login', { required: true })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          className={styles.input}
          autoComplete="current-password"
          {...register('password', { required: true })}
        />
      </div>

      {error && (
        <p className={cn(styles.errorText)}>{error}</p>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
}
