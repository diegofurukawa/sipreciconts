import axiosInstance from './base';
import type { LoginResponse, LoginCredentials } from '../../types/auth.types';

// Constantes para as chaves do localStorage
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user'
} as const;

// Classe de erro customizada para autenticação
class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post<LoginResponse>('auth/login/', {
        username: credentials.username,
        password: credentials.password
      });
      
      const { access, refresh, user } = response.data;
      
      if (!access || !refresh) {
        throw new AuthError('Resposta de autenticação inválida');
      }
      
      // Armazena os tokens e dados do usuário de forma segura
      try {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
        if (user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        }
      } catch (storageError) {
        console.error('Erro ao armazenar dados de autenticação:', storageError);
        throw new AuthError('Falha ao armazenar dados de autenticação');
      }
      
      return response.data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      console.error('Erro no processo de login:', error);
      throw new AuthError(
        'Falha na autenticação. Verifique suas credenciais.',
        error?.response?.status?.toString()
      );
    }
  },

  logout: async (): Promise<void> => {
    const accessToken = AuthService.getAccessToken();
    
    try {
      if (accessToken) {
        await axiosInstance.post('auth/logout/', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }
    } catch (error) {
      console.error('Erro durante o logout:', error);
      // Continua com a limpeza mesmo em caso de erro na API
    } finally {
      AuthService.clearTokens();
    }
  },

  validateToken: async (): Promise<boolean> => {
    const accessToken = AuthService.getAccessToken();
    
    if (!accessToken) {
      return false;
    }

    try {
      const response = await axiosInstance.post('auth/validate-token/', {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.status === 200;
    } catch (error) {
      if (error?.response?.status === 401) {
        // Token inválido ou expirado - limpa os dados
        AuthService.clearTokens();
      }
      console.error('Erro na validação do token:', error);
      return false;
    }
  },

  // Getters seguros para tokens
  getAccessToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Erro ao recuperar access token:', error);
      return null;
    }
  },

  getRefreshToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Erro ao recuperar refresh token:', error);
      return null;
    }
  },

  // Setters seguros para tokens
  setAccessToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      console.error('Erro ao armazenar access token:', error);
      throw new AuthError('Falha ao armazenar token de acesso');
    }
  },

  setRefreshToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('Erro ao armazenar refresh token:', error);
      throw new AuthError('Falha ao armazenar token de refresh');
    }
  },

  // Limpa todos os dados de autenticação
  clearTokens: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Erro ao limpar dados de autenticação:', error);
      // Não lança erro aqui para garantir que o logout sempre "funcione"
    }
  },

  // Recupera dados do usuário
  getUser: () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
      return null;
    }
  }
};

export default AuthService;