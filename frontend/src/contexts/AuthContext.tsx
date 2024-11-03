// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useCallback } from 'react';
import { AuthService, TokenService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias para signOut para compatibilidade
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_USER_KEY = '@SiPreciConts:user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    try {
      setLoading(true);
      const response = await AuthService.login(credentials);
      
      // Salva o usuário no localStorage
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
      setUser(response.user);

      // Configura o token no TokenService
      if (response.token) {
        TokenService.setToken(response.token);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      // Tenta fazer logout no servidor
      await AuthService.logout().catch((error) => {
        console.warn('Erro ao fazer logout no servidor:', error);
      });

    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Sempre limpa os dados locais, mesmo se houver erro no servidor
      localStorage.removeItem(AUTH_USER_KEY);
      TokenService.clearToken();
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Alias para signOut para manter compatibilidade com o nome usado no Navbar
  const logout = useCallback(async () => {
    return signOut();
  }, [signOut]);

  const value = {
    isAuthenticated: !!user,
    loading,
    user,
    signIn,
    signOut,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};