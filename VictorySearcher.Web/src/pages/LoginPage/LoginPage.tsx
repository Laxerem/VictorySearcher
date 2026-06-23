import { LoginForm } from '@/features/auth';
import styles from './LoginPage.module.css';

export function LoginPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h1 className={styles.heading}>VictorySearcher</h1>
        <p className={styles.subtitle}>Внутренний HR-инструмент</p>
        <LoginForm />
      </div>
    </div>
  );
}
