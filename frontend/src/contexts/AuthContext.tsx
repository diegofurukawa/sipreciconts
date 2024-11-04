// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useCallback } from 'react';
import { AuthService, TokenService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  company_id: number;
  company_name?: string;
  role?: string;
  last_login?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias para signOut para compatibilidade
  updateUser: (data: Partial<User>) => void;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_STORAGE_KEY = '@SiPreciConts:auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadStorageData(): AuthState {
  try {
    const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      
      // Restaura o token no serviço
      if (parsedData.token) {
        TokenService.setToken(parsedData.token);
      }
      
      return parsedData;
    }
  } catch (error) {
    console.error('Erro ao carregar dados do storage:', error);
  }
  
  return { user: null, token: null };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(loadStorageData);
  const [loading, setLoading] = useState(false);

  const updateStorage = useCallback((data: AuthState) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    try {
      setLoading(true);
      const response = await AuthService.login(credentials);
      
      const newAuthState = {
        user: response.user,
        token: response.token
      };

      // Atualiza o estado e o storage
      setAuthState(newAuthState);
      updateStorage(newAuthState);

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
  }, [updateStorage]);

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
      localStorage.removeItem(AUTH_STORAGE_KEY);
      TokenService.clearToken();
      setAuthState({ user: null, token: null });
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setAuthState(prev => {
      if (!prev.user) return prev;

      const newState = {
        ...prev,
        user: { ...prev.user, ...data }
      };

      updateStorage(newState);
      return newState;
    });
  }, [updateStorage]);

  // Alias para signOut para manter compatibilidade com o nome usado no Navbar
  const logout = useCallback(async () => {
    return signOut();
  }, [signOut]);

  const value = {
    isAuthenticated: !!authState.user,
    loading,
    user: authState.user,
    signIn,
    signOut,
    logout,
    updateUser
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