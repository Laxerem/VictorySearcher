import { LoginForm } from '@/features/auth';
import styles from './LoginPage.module.css';

const BrandMark = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
    <path d="M5 9 L16 23 L27 9" stroke="#F3F5F8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 9 L16 16" stroke="#46A6C4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function LoginPage() {
  return (
    <main className={styles.auth}>
      <section className={styles.card} aria-labelledby="brand">
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            <BrandMark />
          </span>
          <h1 id="brand" className={styles.wordmark}>
            <b>Victory</b><span>Searcher</span>
          </h1>
          <p className={styles.sub}>Внутренний инструмент скоринга резюме и аналитики рынка</p>
        </div>

        <div className={styles.divider} />

        <LoginForm />

        <p className={styles.foot}>Доступ только для сотрудников Victory Group</p>
      </section>
    </main>
  );
}
