import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { AppLayout } from '@/components/layout/AppLayout/AppLayout';
import styles from './ProfilePage.module.css';

const USERNAME = 'recruiter';

export function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout(): void {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <AppLayout breadcrumb={<span>Профиль</span>}>
      <main className={styles.main}>
      <section className={styles.card}>
        <header className={styles.identity}>
          <span className={styles.avatar}>{USERNAME.slice(0, 2).toUpperCase()}</span>
          <div className={styles.meta}>
            <p className={styles.name}>{USERNAME}</p>
            <p className={styles.role}>Рекрутер</p>
          </div>
        </header>

        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </section>
      </main>
    </AppLayout>
  );
}
