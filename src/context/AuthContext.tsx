import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const savedToken = localStorage.getItem('vosvos_auth_token');
    const savedUser = localStorage.getItem('vosvos_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Kayıtlı oturum çözülemedi:', e);
        localStorage.removeItem('vosvos_auth_token');
        localStorage.removeItem('vosvos_user');
      }
    }
    setIsLoading(false);
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Giriş yapılamadı.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('vosvos_auth_token', data.token);
      localStorage.setItem('vosvos_user', JSON.stringify(data.user));
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Bağlantı hatası oluştu.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Kayıt yapılamadı.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('vosvos_auth_token', data.token);
      localStorage.setItem('vosvos_user', JSON.stringify(data.user));
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Bağlantı hatası oluştu.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vosvos_auth_token');
    localStorage.removeItem('vosvos_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth, bir AuthProvider içerisinde kullanılmalıdır.');
  }
  return context;
};
