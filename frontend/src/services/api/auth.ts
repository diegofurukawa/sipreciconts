// src/services/api/auth.ts
import { api } from './base';
import { TokenService } from './token';
import { Auth, ApiError } from './types';
import { handleApiError } from './utils';

interface LoginSuccessData {
  access: string;
  refresh: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
    company_id: number;
    company_name?: string;
    role?: string;
    last_login?: string;
  };
}

interface TokenResponse {
  access: string;
}

export const AuthService = {
  async login(credentials: Auth.Credentials): Promise<LoginSuccessData> {
    try {
      const response = await api.post<LoginSuccessData>('auth/login/', credentials);
      const { access, refresh, user } = response.data;
      
      // Armazena os tokens
      TokenService.setTokens({ access, refresh });
      
      // Configura o token de acesso para as próximas requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw handleApiError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = TokenService.getRefreshToken();
      if (refreshToken) {
        // Tenta invalidar o token no servidor
        await api.post('/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continua com o logout mesmo se houver erro no servidor
    } finally {
      // Limpa tokens e headers
      TokenService.clearTokens();
      delete api.defaults.headers.common['Authorization'];
    }
  },

  async refreshToken(refresh_token: string): Promise<TokenResponse> {
    try {
      const response = await api.post<TokenResponse>('/token/refresh/', {
        refresh: refresh_token
      });

      const { access } = response.data;
      
      // Atualiza o token de acesso
      TokenService.setAccessToken(access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Se houver erro ao atualizar o token, força o logout
      await this.logout();
      throw handleApiError(error);
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      const token = TokenService.getAccessToken();
      if (!token) return false;

      await api.post('/token/verify/', { token });
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  async checkAuth(): Promise<boolean> {
    try {
      const accessToken = TokenService.getAccessToken();
      const refreshToken = TokenService.getRefreshToken();

      // Se não há tokens, não está autenticado
      if (!accessToken || !refreshToken) {
        return false;
      }

      // Tenta validar o token atual
      const isValid = await this.validateToken();
      if (isValid) {
        return true;
      }

      // Se o token não é válido, tenta refresh
      await this.refreshToken(refreshToken);
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      // Se houver qualquer erro, considera não autenticado
      return false;
    }
  },

  // Método auxiliar para configurar o estado inicial da autenticação
  async initializeAuth(): Promise<boolean> {
    try {
      const isAuthenticated = await this.checkAuth();
      if (isAuthenticated) {
        const accessToken = TokenService.getAccessToken();
        if (accessToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
      }
      return isAuthenticated;
    } catch (error) {
      console.error('Auth initialization error:', error);
      return false;
    }
  }
};