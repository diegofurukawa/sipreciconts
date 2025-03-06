// src/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import axios from 'axios';
import { DEFAULT_API_CONFIG } from '@/services/apiMainService/config';

// Interface para as credenciais de login
interface LoginCredentials {
  login: string;  // Garantindo que o nome do campo seja "login"
  password: string;
}

// Interface para a resposta de autenticação atualizada
interface AuthResponse {
  access: string;
  refresh: string;
  session_id: string;
  user: {
    id: number;
    login: string;
    name: string;
    email: string;
    type: string;
    company_id: string | null;
    company_name: string | null;
    last_login: string | null;
  };
  expires_in: number;
  token_type: string;
}

// Configuração base do axios
const api = axios.create({
  baseURL: `${DEFAULT_API_CONFIG.baseURL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAuth = () => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('sessionId'));

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      // Log para debug
      console.debug('Enviando credenciais:', {
        login: credentials.login,
        password: '[PROTEGIDO]'
      });

      // Garantindo que os campos sejam enviados como esperado pelo backend
      const response = await api.post<AuthResponse>('/auth/login/', {
        login: credentials.login,
        password: credentials.password
      });

      // Log para debug
      console.debug('Resposta do login:', { 
        success: !!response,
        hasUser: !!response.data.user,
        hasToken: !!response.data.access
      });

      const { access, refresh, session_id, user, expires_in } = response.data;
      
      // Armazena o token, refresh token e session_id
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('sessionId', session_id);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configura o token para todas as requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      api.defaults.headers.common['X-Session-ID'] = session_id;
      
      setToken(access);
      setSessionId(session_id);
      setUser(user);
      
      return user;
    } catch (error) {
      console.error('Erro detalhado do login:', error);
      
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

  const logout = useCallback(async () => {
    try {
      // Se temos um token, tenta fazer logout no servidor
      if (token) {
        await api.post('/auth/logout/');
      }
      
      // Limpa os dados locais
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
      
      // Limpa os headers
      delete api.defaults.headers.common['Authorization'];
      delete api.defaults.headers.common['X-Session-ID'];
      
      // Atualiza o estado
      setToken(null);
      setSessionId(null);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo se der erro, limpa os dados locais
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
      setToken(null);
      setSessionId(null);
      setUser(null);
    }
  }, [token]);

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
          console.error('Erro ao renovar token:', refreshError);
          await logout();
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
      }
      
      return Promise.reject(error);
    }
  );

  // Função para recuperar o usuário a partir do localStorage ao inicializar
  const initializeAuth = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erro ao parsear dados do usuário:', e);
        localStorage.removeItem('user');
      }
    }
    
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      api.defaults.headers.common['X-Session-ID'] = storedSessionId;
    }
  }, []);

  // Chama initializeAuth apenas uma vez ao montar o componente
  useState(() => {
    initializeAuth();
  });

  return {
    user,
    token,
    sessionId,
    login,
    logout,
    isAuthenticated: !!token,
  };
};

// Exportar a instância do axios configurada para uso em outros lugares da aplicação
export const apiClient = api;