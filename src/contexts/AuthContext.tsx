import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearSession, loadSession, loginAccount, registerAccount } from '../services/authStorage';
import { User } from '../types';
import { reportError } from '../utils/reportError';

interface AuthContextValue {
  user: User | null;
  /** True while the saved session is being read on app start. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession()
      .then(setUser)
      .catch((error: unknown) => {
        // An unreadable session just means the user has to log in again.
        reportError('auth: load session', error);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setUser(await loginAccount(email, password));
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setUser(await registerAccount(username, email, password));
  }, []);

  // Clearing the user is enough: RootNavigator swaps to the login stack by itself.
  // The user is logged out even if deleting the saved session fails.
  const logout = useCallback(async () => {
    try {
      await clearSession();
    } catch (error) {
      reportError('auth: clear session', error);
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
