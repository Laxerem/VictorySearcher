import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import styles from './AppLayout.module.css';


const BrandMark = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
    <path d="M5 9 L16 23 L27 9" stroke="#F3F5F8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 9 L16 16" stroke="#46A6C4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ListIcon = () => (
  <svg className={styles.ic} viewBox="0 0 24 24">
    <path d="M4 6h16M4 12h16M4 18h10" />
  </svg>
);

const ChartIcon = () => (
  <svg className={styles.ic} viewBox="0 0 24 24">
    <path d="M4 19V5M4 19h16M8 16v-4M13 16V8M18 16v-6" />
  </svg>
);

interface Props {
  children: ReactNode;
  context?: string;
  username?: string;
}

export function AppLayout({ children, context = 'Вакансии', username = 'recruiter' }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const isScoringActive = location.pathname.startsWith('/scoring');
  const isMarketActive = location.pathname.startsWith('/market');

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <span className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            <BrandMark />
          </span>
          <span className={styles.brandName}>
            <b>Victory</b><span>Searcher</span>
          </span>
        </span>

        <span className={styles.context}>
          <span>Скоринг</span>
          <span className={styles.contextSep}>/</span>
          <span className={styles.contextActive}>{context}</span>
        </span>

        <span className={styles.spacer} />

        <span className={styles.account}>
          <span className={styles.avatar}>{username.slice(0, 2).toUpperCase()}</span>
          <span>{username}</span>
        </span>
      </header>

      <div className={styles.body}>
        <nav className={styles.rail} aria-label="Разделы">
          <p className={styles.eyebrow}>Скоринг</p>
          <button
            type="button"
            className={cn(styles.railItem, isScoringActive && styles.railItemActive)}
            onClick={() => navigate('/scoring')}
          >
            <ListIcon />
            Вакансии
          </button>

          <div className={styles.railGroup}>
            <p className={styles.eyebrow}>Аналитика</p>
            <button
              type="button"
              className={cn(styles.railItem, isMarketActive && styles.railItemActive)}
              onClick={() => navigate('/market')}
            >
              <ChartIcon />
              Дашборд ролей
            </button>
          </div>
        </nav>

        {children}
      </div>
    </div>
  );
}
