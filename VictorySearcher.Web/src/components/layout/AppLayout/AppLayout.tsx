import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/utils/cn';
import logoUrl from '@/assets/victorysearcher-logo.png';
import styles from './AppLayout.module.css';

interface Props {
  children: ReactNode;
  /** Breadcrumb rendered in the top bar after the brand mark. */
  breadcrumb?: ReactNode;
  /** Hide the primary "New vacancy" action (e.g. on secondary pages). */
  hideNewVacancy?: boolean;
  username?: string;
}

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
  </svg>
);

export function AppLayout({ children, breadcrumb, hideNewVacancy = false, username = 'recruiter' }: Props) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout(): void {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.left}>
          <button
            type="button"
            className={styles.brand}
            onClick={() => navigate('/scoring')}
            aria-label="К списку вакансий"
          >
            <img src={logoUrl} alt="" className={styles.logo} />
            <span className={styles.wordmark}>
              Victory<span className={styles.wordmarkMuted}>Searcher</span>
            </span>
          </button>
          {breadcrumb && (
            <>
              <span className={styles.divider} aria-hidden="true" />
              <div className={styles.breadcrumb}>{breadcrumb}</div>
            </>
          )}
        </div>

        <div className={styles.right}>
          {!hideNewVacancy && (
            <button
              type="button"
              className={styles.newVacancy}
              onClick={() => navigate('/scoring?create=1')}
            >
              <PlusIcon />
              Новая вакансия
            </button>
          )}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger className={styles.avatar} aria-label="Меню аккаунта">
              {username.slice(0, 2).toUpperCase()}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className={styles.menuContent} align="end" sideOffset={8}>
                <DropdownMenu.Item className={styles.menuItem} onSelect={() => navigate('/profile')}>
                  Профиль
                </DropdownMenu.Item>
                <DropdownMenu.Separator className={styles.menuSeparator} />
                <DropdownMenu.Item
                  className={cn(styles.menuItem, styles.menuItemDanger)}
                  onSelect={handleLogout}
                >
                  Выйти
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>

      <div className={styles.body}>{children}</div>
    </div>
  );
}
