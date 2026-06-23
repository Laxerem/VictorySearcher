import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/providers/AuthProvider';
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
          path="/scoring/vacancies/:id/results"
          element={
            <ProtectedRoute>
              <ScoringResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <div style={{ padding: 'var(--space-8)', color: 'var(--color-text)' }}>
                Market Analytics — coming soon
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
