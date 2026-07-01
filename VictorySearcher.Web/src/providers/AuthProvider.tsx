import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getToken, setToken, clearToken, registerUnauthorizedHandler } from '@/api/client';

interface AuthContextValue {
  token: string | null;
  login: (token: string, remember?: boolean) => void;
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

  function login(newToken: string, remember = true): void {
    setToken(newToken, remember);
    setTokenState(newToken);
  }

  function logout(): void {
    clearToken();
    setTokenState(null);
  }

  useEffect(() => {
    registerUnauthorizedHandler(logout);
  }, []); // register once on mount; logout is stable

  const value: AuthContextValue = {
    token,
    login,
    logout,
    isAuthenticated: token !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
