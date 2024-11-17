// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, TokenService } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import type { AuthUser, AuthCredentials, AuthState as ApiAuthState } from '@/services/api/modules/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  companyId?: string;
  sessionId?: string | undefined;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  companyId?: string;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadStorageData(): AuthState {
  try {
    const token = TokenService.getAccessToken();
    const userStr = localStorage.getItem('user');
    const sessionId = localStorage.getItem('session_id') || undefined;
    
    if (token && userStr) {
      const user = JSON.parse(userStr) as AuthUser;
      return {
        user,
        token,
        companyId: user?.company_id,
        sessionId
      };
    }
  } catch (error) {
    console.error('Erro ao carregar dados do storage:', error);
  }
  
  return { 
    user: null, 
    token: null,
    companyId: undefined,
    sessionId: undefined
  };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(loadStorageData);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const initialState = await authService.initializeAuth();
        if (!initialState.isAuthenticated) {
          await signOut();
        } else {
          setAuthState({
            user: initialState.user,
            token: TokenService.getAccessToken(),
            companyId: initialState.company_id,
            sessionId: initialState.session_id
          });
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

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    try {
      setLoading(true);
  
      // Log para validação
      console.log('Credenciais recebidas:', { 
        login: credentials.login,
        hasPassword: !!credentials.password 
      });
  
      const response = await authService.login({
        login: credentials.login,
        password: credentials.password
      });

      // Log para debug
      console.log('Resposta do login:', { 
        success: !!response,
        hasUser: !!response?.user,
        hasToken: !!response?.access
      });

      // Atualiza o estado
      setAuthState({
        user: response.user,
        token: response.access,
        companyId: response.user?.company_id,
        sessionId: response.session_id
      });

      showToast({
        type: 'success',
        title: 'Login realizado',
        message: 'Bem-vindo!'
      });

      navigate('/');
    } catch (error: any) {
      console.error('Erro detalhado do login:', error);
      
      let errorMessage = 'Erro ao realizar login. Tente novamente.';
      
      if (error.message === 'USUARIO_INATIVO') {
        errorMessage = 'Usuário está inativo no sistema';
      } else if (error.response?.status === 400) {
        errorMessage = 'Dados de login inválidos';
      } else if (error.response?.status === 401) {
        errorMessage = 'Usuário ou senha inválidos';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      showToast({
        type: 'error',
        title: 'Erro no login',
        message: errorMessage
      });

      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, showToast]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      const token = TokenService.getAccessToken();
      if (token) {
        try {
          await authService.logout();
        } catch (error) {
          console.warn('Erro ao fazer logout no servidor:', error);
        }
      }

      // Reseta o estado e limpa o storage
      setAuthState({ 
        user: null, 
        token: null,
        companyId: undefined,
        sessionId: undefined 
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao fazer logout'
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, showToast]);

  const updateUser = useCallback((data: Partial<AuthUser>) => {
    setAuthState(prev => {
      if (!prev.user) return prev;

      const updatedUser = { ...prev.user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        ...prev,
        user: updatedUser,
        companyId: updatedUser?.company_id
      };
    });
  }, []);

  const value = {
    isAuthenticated: !!authState.user,
    loading,
    user: authState.user,
    companyId: authState.companyId,
    signIn,
    signOut,
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

export type { AuthContextType, AuthState };