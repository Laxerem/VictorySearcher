import { LoginForm } from '@/features/auth';
import logoUrl from '@/assets/victorysearcher-logo.png';
import styles from './LoginPage.module.css';

export function LoginPage() {
  return (
    <main className={styles.auth}>
      {/* ============ Brand panel ============ */}
      <section className={styles.brandPanel} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.vignette} />
        <div className={styles.streak} />

        <div className={styles.brandInner}>
          <div className={styles.brandTop}>
            <img src={logoUrl} alt="" className={styles.logo} />
            <span className={styles.wordmark}>
              Victory<span className={styles.wordmarkMuted}>Searcher</span>
            </span>
          </div>

          <div className={styles.brandHero}>
            <p className={styles.eyebrow}>Личный кабинет</p>
            <h1 className={styles.heroTitle}>
              Вход<br />в&nbsp;систему
            </h1>
            <p className={styles.heroText}>
              Скоринг резюме и аналитика рынка труда в едином рабочем
              пространстве.
            </p>
          </div>

          <div className={styles.brandBadge}>
            <span className={styles.badgeDot} />
            <span className={styles.badgeText}>Внутренний инструмент · HR</span>
          </div>
        </div>
      </section>

      {/* ============ Form panel ============ */}
      <section className={styles.formPanel}>
        <div className={styles.formInner}>
          <h2 className={styles.formTitle}>Вход</h2>
          <p className={styles.formSubtitle}>
            Введите данные учётной записи, чтобы продолжить.
          </p>

          <LoginForm />

          <p className={styles.foot}>
            VictorySearcher — внутренний сервис. Доступ выдаёт администратор.
          </p>
        </div>
      </section>
    </main>
  );
}
