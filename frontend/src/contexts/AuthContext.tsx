// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, TokenService } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import type { AuthUser, AuthCredentials, AuthResponse } from '@/services/api';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
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
      
      // Restaura os tokens no serviço
      if (parsedData.access && parsedData.refresh) {
        TokenService.setTokens({
          access: parsedData.access,
          refresh: parsedData.refresh
        });
      }
      
      return {
        user: parsedData.user,
        token: parsedData.access
      };
    }
  } catch (error) {
    console.error('Erro ao carregar dados do storage:', error);
  }
  
  return { user: null, token: null };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(loadStorageData);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Carrega o estado inicial de autenticação
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAuth = loadStorageData();
        if (storedAuth.token) {
          // Verifica se o token ainda é válido
          const isValid = await authService.validateToken(storedAuth.token);
          if (!isValid) {
            await signOut();
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        await signOut();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const updateStorage = useCallback((data: AuthResponse) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  }, []);

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      const newAuthState = {
        user: response.user,
        token: response.access
      };

      // Atualiza o estado e o storage
      setAuthState(newAuthState);
      updateStorage(response);

      showToast({
        type: 'success',
        title: 'Login realizado',
        message: 'Bem-vindo de volta!'
      });

      // Redireciona para home após login
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      showToast({
        type: 'error',
        title: 'Erro no login',
        message: 'Credenciais inválidas'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [updateStorage, navigate, showToast]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      // Tenta fazer logout no servidor
      await authService.logout().catch((error) => {
        console.warn('Erro ao fazer logout no servidor:', error);
      });

    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Sempre limpa os dados locais, mesmo se houver erro no servidor
      localStorage.removeItem(AUTH_STORAGE_KEY);
      TokenService.clearAll();
      setAuthState({ user: null, token: null });
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const updateUser = useCallback((data: Partial<AuthUser>) => {
    setAuthState(prev => {
      if (!prev.user) return prev;

      const newState = {
        ...prev,
        user: { ...prev.user, ...data }
      };

      // Atualiza também no storage
      const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
          ...parsedData,
          user: { ...parsedData.user, ...data }
        }));
      }

      return newState;
    });
  }, []);

  // Alias para signOut
  const logout = useCallback(() => signOut(), [signOut]);

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

// export default AuthContext;