import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  highScore?: number;
  soulMatch?: string | null;
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
  updateUserData: (data: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for local mock DB in case backend API is not reachable (e.g. static preview)
const getLocalUsers = (): Array<User & { passwordHash?: string }> => {
  try {
    const raw = localStorage.getItem('vosvos_users_db');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalUsers = (users: Array<User & { passwordHash?: string }>) => {
  localStorage.setItem('vosvos_users_db', JSON.stringify(users));
};

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

  const updateUserData = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('vosvos_user', JSON.stringify(updated));

    // Update in local users db as well
    const users = getLocalUsers();
    const idx = users.findIndex((u) => u.id === user.id || u.email === user.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedFields };
      saveLocalUsers(users);
    }
  };

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try server API first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (res.ok && isJson) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('vosvos_auth_token', data.token);
        localStorage.setItem('vosvos_user', JSON.stringify(data.user));
        closeAuthModal();
        return { success: true };
      } else if (res.status === 401 || res.status === 400) {
        const data = isJson ? await res.json() : {};
        return { success: false, error: data.error || 'E-posta veya şifre hatalı.' };
      }
    } catch {
      // Server not reachable or static preview mode, proceed to local registry fallback
    }

    // 2. Local fallback if API is not running or on client-only runtime
    const users = getLocalUsers();
    const found = users.find((u) => u.email === normalizedEmail);

    if (!found) {
      // If it's a first-time demo user, allow easy access or require register
      return {
        success: false,
        error: 'Kullanıcı bulunamadı. Lütfen önce "Kayıt Ol" sekmesinden hesap oluşturun.',
      };
    }

    if (found.passwordHash && found.passwordHash !== password) {
      return { success: false, error: 'E-posta veya şifre hatalı.' };
    }

    const fallbackUser: User = {
      id: found.id,
      email: found.email,
      name: found.name,
      highScore: found.highScore || 0,
      soulMatch: found.soulMatch || null,
      createdAt: found.createdAt,
    };
    const dummyToken = 'jwt_vosvos_token_' + Date.now();

    setUser(fallbackUser);
    setToken(dummyToken);
    localStorage.setItem('vosvos_auth_token', dummyToken);
    localStorage.setItem('vosvos_user', JSON.stringify(fallbackUser));
    closeAuthModal();
    return { success: true };
  };

  const register = async (name: string, email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    // 1. Try server API first
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: normalizedEmail, password }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (res.ok && isJson) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('vosvos_auth_token', data.token);
        localStorage.setItem('vosvos_user', JSON.stringify(data.user));
        closeAuthModal();
        return { success: true };
      } else if (res.status === 409 || res.status === 400) {
        const data = isJson ? await res.json() : {};
        return { success: false, error: data.error || 'Bu e-posta adresi ile zaten bir hesap var.' };
      }
    } catch {
      // Server not reachable or static preview mode, proceed to local registry fallback
    }

    // 2. Local fallback if API is not running
    const users = getLocalUsers();
    if (users.some((u) => u.email === normalizedEmail)) {
      return { success: false, error: 'Bu e-posta adresi ile zaten kayıtlı bir hesap var.' };
    }

    const newUser: User & { passwordHash: string } = {
      id: 'usr_' + Date.now(),
      email: normalizedEmail,
      name: cleanName,
      passwordHash: password,
      highScore: 0,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveLocalUsers(users);

    const clientUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      highScore: 0,
      createdAt: newUser.createdAt,
    };
    const dummyToken = 'jwt_vosvos_token_' + Date.now();

    setUser(clientUser);
    setToken(dummyToken);
    localStorage.setItem('vosvos_auth_token', dummyToken);
    localStorage.setItem('vosvos_user', JSON.stringify(clientUser));
    closeAuthModal();
    return { success: true };
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
        updateUserData,
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
