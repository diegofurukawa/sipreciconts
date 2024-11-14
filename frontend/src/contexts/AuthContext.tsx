import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, TokenService } from '@/services/api';
import { UserSession } from '@/services/api/UserSession';
import { useToast } from '@/hooks/useToast';
import type { AuthUser, AuthCredentials, AuthResponse } from '@/services/api';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  companyId?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  companyId?: number;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
  switchCompany?: (companyId: number) => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_STORAGE_KEY = '@SiPreciConts:auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadStorageData(): AuthState {
  try {
    // Tenta carregar a sessão do usuário primeiro
    const session = UserSession.load();
    if (session) {
      return {
        user: session.user as AuthUser,
        token: session.token,
        companyId: session.companyId
      };
    }

    // Fallback para o storage antigo
    const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      
      // Migra dados antigos para o novo formato de sessão
      if (parsedData.access && parsedData.refresh) {
        const session = UserSession.createFromAuth({
          user_id: parsedData.user?.id,
          company_id: parsedData.user?.company_id,
          token: parsedData.access,
          refresh_token: parsedData.refresh
        });

        return {
          user: parsedData.user,
          token: parsedData.access,
          companyId: parsedData.user?.company_id
        };
      }
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

  // Inicialização e validação da autenticação
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = UserSession.load();
        if (session) {
          const isValid = await session.validate();
          if (!isValid) {
            await signOut();
          } else {
            // Atualiza o estado com os dados da sessão
            setAuthState({
              user: session.user as AuthUser,
              token: session.token,
              companyId: session.companyId
            });
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

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      // Cria nova sessão
      const session = UserSession.createFromAuth({
        user_id: response.user.id,
        company_id: response.user.company_id,
        token: response.access,
        refresh_token: response.refresh,
        expires_in: 3600 // 1 hora, ajuste conforme necessário
      });

      // Atualiza o estado
      setAuthState({
        user: response.user,
        token: response.access,
        companyId: response.user.company_id
      });

      showToast({
        type: 'success',
        title: 'Login realizado',
        message: 'Bem-vindo de volta!'
      });

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
  }, [navigate, showToast]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      const session = UserSession.load();
      if (session) {
        // Tenta fazer logout no servidor
        await authService.logout().catch((error) => {
          console.warn('Erro ao fazer logout no servidor:', error);
        });

        // Encerra a sessão
        session.end();
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpa todos os dados
      UserSession.clear();
      TokenService.clearAll();
      localStorage.removeItem(AUTH_STORAGE_KEY);
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

      // Atualiza a sessão
      const session = UserSession.load();
      if (session) {
        session.update({ user: { ...session.user, ...data } });
      }

      return newState;
    });
  }, []);

  const switchCompany = useCallback(async (companyId: number) => {
    try {
      const session = UserSession.load();
      if (session) {
        session.switchCompany(companyId);
        setAuthState(prev => ({
          ...prev,
          companyId
        }));

        showToast({
          type: 'success',
          title: 'Empresa alterada',
          message: 'Empresa selecionada com sucesso'
        });
      }
    } catch (error) {
      console.error('Erro ao trocar empresa:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível trocar de empresa'
      });
    }
  }, [showToast]);

  // Alias para signOut
  const logout = useCallback(() => signOut(), [signOut]);

  const value = {
    isAuthenticated: !!authState.user,
    loading,
    user: authState.user,
    companyId: authState.companyId,
    signIn,
    signOut,
    logout,
    updateUser,
    switchCompany
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