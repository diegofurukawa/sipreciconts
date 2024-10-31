// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService, APIError } from '../services/api';
import type { AuthResponse } from '../services/api';

interface AuthContextData {
  signed: boolean;
  user: AuthResponse['user'] | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(() => {
    return authService.getCurrentUser();
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar estado de autenticação inicial
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Gerenciar redirecionamentos baseados no estado de autenticação
  useEffect(() => {
    if (!loading) {
      if (!user && location.pathname !== '/login') {
        navigate('/login', { replace: true });
      } else if (user && location.pathname === '/login') {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, location.pathname, navigate]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login(username, password);
      setUser(response.user);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new Error('Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};