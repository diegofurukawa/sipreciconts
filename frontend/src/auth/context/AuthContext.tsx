// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TokenService } from '@/auth/services/TokenService';
import { UserSessionService } from '@/auth/services/UserSessionService';
import { authService } from '@/auth/services/authService';
import { useToast } from '@/hooks/useToast';
import type { AuthCredentials } from '@/auth/services/authService';
import type { AuthUser } from '@/auth/types/auth_types';
import type { AuthState, AuthContextType, AuthProviderProps } from '@/auth/types/auth_types';

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
        sessionId,
        isAuthenticated: !!user && !!token,
        loading: false                       
      };
    }
  } catch (error) {
    console.error('Erro ao carregar dados do storage:', error);
  }
  
  return { 
    user: null, 
    token: null,
    companyId: undefined,
    sessionId: undefined,
    isAuthenticated: false,
    loading: false
  };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(loadStorageData);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  
  // Prevent infinite loops when checking session
  const initialCheckDone = useRef(false);
  
  // Control for avoiding multiple session expiry notifications
  const sessionExpiryRef = useRef({
    isHandling: false,
    lastNotified: 0,
    minInterval: 5000 // 5 seconds between notifications
  });

  // Handle expired sessions
  const handleSessionExpired = useCallback(() => {
    const now = Date.now();
    const { isHandling, lastNotified, minInterval } = sessionExpiryRef.current;
    
    // Prevent multiple simultaneous calls and don't notify too frequently
    if (isHandling || (now - lastNotified) < minInterval) {
      return;
    }
    
    // Update control state
    sessionExpiryRef.current = {
      ...sessionExpiryRef.current,
      isHandling: true,
      lastNotified: now
    };
    
    // Clear local storage
    TokenService.clearAll();
    UserSessionService.clear();
    
    // Set authentication state to false
    setAuthState({ 
      user: null, 
      token: null,
      companyId: undefined,
      sessionId: undefined,
      isAuthenticated: false,
      loading: false
    });
    
    // Show feedback to user, only if not on login page
    if (location.pathname !== '/login') {
      showToast({
        type: 'warning',
        title: 'Sessão expirada',
        message: 'Sua sessão expirou. Por favor, faça login novamente.'
      });
      
      // Redirect to login page with a query parameter
      navigate('/login?session=expired', { replace: true });
    }
    
    // Release lock after processing
    setTimeout(() => {
      sessionExpiryRef.current.isHandling = false;
    }, 500);
    
  }, [navigate, showToast, location.pathname]);

  // Add event listener for session expired event
  useEffect(() => {
    const handleSessionExpiredEvent = (event: Event) => {
      // Prevent multiple processing of sequential events
      event.stopPropagation();
      handleSessionExpired();
    };
    
    window.addEventListener('auth:sessionExpired', handleSessionExpiredEvent);
    
    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpiredEvent);
    };
  }, [handleSessionExpired]);
  
  // Check for session expired parameter in login page URL
  useEffect(() => {
    if (location.pathname === '/login') {
      const params = new URLSearchParams(location.search);
      const sessionExpired = params.get('session') === 'expired';
      
      if (sessionExpired) {
        // Check if already shown recently
        const now = Date.now();
        if ((now - sessionExpiryRef.current.lastNotified) > sessionExpiryRef.current.minInterval) {
          sessionExpiryRef.current.lastNotified = now;
          
          showToast({
            type: 'warning',
            title: 'Sessão expirada',
            message: 'Sua sessão expirou. Por favor, faça login novamente.'
          });
        }
        
        // Clear the URL parameter to avoid repeated messages on refreshes
        window.history.replaceState({}, document.title, location.pathname);
      }
    }
  }, [location.pathname, location.search, showToast]);

  useEffect(() => {
    const initializeAuth = async () => {
      // If we've already done the initial check, skip to prevent loops
      if (initialCheckDone.current) {
        setLoading(false);
        return;
      }
      
      try {
        initialCheckDone.current = true;
        
        const token = TokenService.getAccessToken();
        const session = UserSessionService.load();
        
        // If no credentials found, quietly sign out
        if (!token || !session) {
          await signOut(true); // Silent logout - no notification
          return;
        }
        
        // If we already have a user in state, use it
        if (authState.user) {
          setLoading(false);
          return;
        }
        
        // Otherwise set from storage
        setAuthState({
          user: session.user,
          token: token,
          companyId: session.companyId || undefined,
          sessionId: session.sessionId,
          isAuthenticated: true,
          loading: false
        });
        
      } catch (error) {
        console.error('Error initializing authentication:', error);
        await signOut(true); // Silent logout
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    try {
      setLoading(true);
  
      console.log('Credentials received:', { 
        login: credentials.login,
        hasPassword: !!credentials.password 
      });
  
      const response = await authService.login({
        login: credentials.login,
        password: credentials.password
      });

      console.log('Login response:', { 
        success: !!response,
        hasUser: !!response?.user,
        hasToken: !!response?.access
      });

      // Update state
      setAuthState({
        user: response.user,
        token: response.access,
        companyId: response.user?.company_id,
        sessionId: response.session_id,
        isAuthenticated: true,
        loading: false
      });

      showToast({
        type: 'success',
        title: 'Login realizado',
        message: 'Bem-vindo!'
      });

      navigate('/');
    } catch (error: any) {
      console.error('Detailed login error:', error);
      
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

  const signOut = useCallback(async (silent: boolean = false) => {
    try {
      setLoading(true);
      
      const token = TokenService.getAccessToken();
      if (token) {
        try {
          await authService.logout();
        } catch (error) {
          console.warn('Error logging out from the server:', error);
        }
      }

      // Reset state and clear storage
      TokenService.clearAll();
      UserSessionService.clear();
      
      setAuthState({ 
        user: null, 
        token: null,
        companyId: undefined,
        sessionId: undefined,
        isAuthenticated: false,
        loading: false
      });
      
      // Always show toast on explicit logout (when not silent)
      if (!silent) {
        showToast({
          type: 'success',
          title: 'Logout realizado',
          message: 'Você foi desconectado com sucesso'
        });
        
        // Redirect to login only if not silent and not already on login page
        if (!location.pathname.includes('/login')) {
          navigate('/login');
        }
      } else {
        // For silent logout - only redirect if not on login page
        if (!location.pathname.includes('/login')) {
          navigate('/login', { replace: true });
        }
      }
    } catch (error) {
      console.error('Error during logout:', error);
      if (!silent) {
        showToast({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao fazer logout'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, showToast, location.pathname]);

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

  // New method to refresh user information
  const refreshUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const validationResult = await authService.validate();
      
      // Se validationResult for true, significa que a sessão é válida
      if (validationResult === true) {
        // Tentar carregar o usuário do localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr) as AuthUser;
          updateUser(user);
          return user;
        } else {
          throw new Error('User data not found in storage');
        }
      }
      // Caso validationResult seja um objeto com 'user'
      else if (validationResult && typeof validationResult === 'object' && 'user' in validationResult) {
        const { user } = validationResult as { user: AuthUser };
        if (user) {
          updateUser(user);
          return user;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error refreshing user info:', error);
      // Opcional: Tratar o erro de forma mais específica, por exemplo, redirecionar para login
      handleSessionExpired();
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateUser, handleSessionExpired]);

  const value = {
    isAuthenticated: !!authState.user,
    loading,
    user: authState.user,
    companyId: authState.companyId,
    signIn,
    signOut: (silent = false) => signOut(silent),
    updateUser,
    refreshUserInfo
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