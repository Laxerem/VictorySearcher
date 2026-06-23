import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getToken, setToken, clearToken } from '@/api/client';

interface AuthContextValue {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  useEffect(() => {
    const stored = getToken();
    if (stored !== token) {
      setTokenState(stored);
    }
  }, [token]);

  function login(newToken: string): void {
    setToken(newToken);
    setTokenState(newToken);
  }

  function logout(): void {
    clearToken();
    setTokenState(null);
  }

  const value: AuthContextValue = {
    token,
    login,
    logout,
    isAuthenticated: token !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
