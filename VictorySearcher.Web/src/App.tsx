import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { AppLayout } from '@/components/layout/AppLayout/AppLayout';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';
import { ScoringPage } from '@/pages/ScoringPage/ScoringPage';
import { VacancyPage } from '@/pages/VacancyPage/VacancyPage';
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/scoring" replace />} />

        <Route
          path="/scoring"
          element={
            <ProtectedRoute>
              <ScoringPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scoring/vacancies/:id"
          element={
            <ProtectedRoute>
              <VacancyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <AppLayout breadcrumb={<span>Аналитика рынка</span>}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '42px 32px', color: 'var(--text-muted)' }}>
                  Аналитика рынка — в разработке
                </div>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
