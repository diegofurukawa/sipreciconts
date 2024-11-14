// src/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import axios from 'axios';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: any; // Tipo do usuário deve ser definido baseado na sua API
}

// Configuração base do axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login/', credentials);

      const { access, refresh, user } = response.data;
      
      // Armazena o token e refresh token
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Configura o token para todas as requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      setToken(access);
      setUser(user);
      
      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Serviço de autenticação indisponível. Contate o administrador.');
        }
        const message = error.response?.data?.error || 
                       error.response?.data?.detail ||
                       'Falha na autenticação. Verifique suas credenciais.';
        throw new Error(message);
      }
      throw new Error('Erro ao conectar ao servidor. Verifique sua conexão.');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  }, []);

  // Configurar interceptor para renovação de token
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await api.post('/auth/refresh/', { refresh: refreshToken });
          const { access } = response.data;
          
          localStorage.setItem('token', access);
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          logout();
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
      }
      
      return Promise.reject(error);
    }
  );

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };
};

// Exportar a instância do axios configurada para uso em outros lugares da aplicação
export const apiClient = api;