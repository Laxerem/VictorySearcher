import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { AppLayout } from '@/components/layout/AppLayout/AppLayout';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';
import { ScoringPage } from '@/pages/ScoringPage/ScoringPage';
import { VacancyPage } from '@/pages/VacancyPage/VacancyPage';
import { ScoringResultsPage } from '@/pages/ScoringResultsPage/ScoringResultsPage';

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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/scoring"
          element={
            <ProtectedRoute>
              <AppLayout context="Вакансии">
                <ScoringPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/scoring/vacancies/:id"
          element={
            <ProtectedRoute>
              <AppLayout context="Вакансии">
                <VacancyPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/scoring/vacancies/:id/results"
          element={
            <ProtectedRoute>
              <AppLayout context="Результаты">
                <ScoringResultsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <AppLayout context="Дашборд ролей">
                <div style={{ padding: 'var(--space-8)', color: 'var(--text-500)' }}>
                  Market Analytics — coming soon
                </div>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
