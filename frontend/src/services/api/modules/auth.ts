// src/services/api/modules/auth.ts
import { ApiService } from '../ApiService';
import { TokenService } from '../token';
import type { ApiResponse } from '../types';

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  company_id: number;
  company_name?: string;
  enabled: boolean;
  last_login?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface TokenResponse {
  access: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  company_id?: number;
  loading: boolean;
}

class AuthApiService extends ApiService {
  private readonly baseUrl = '/auth';

  /**
   * Realiza login do usuário
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await this.post<AuthResponse>(`${this.baseUrl}/login/`, credentials);
      
      // Armazena tokens
      TokenService.setTokens({
        access: response.access,
        refresh: response.refresh
      });
      
      return response;
    } catch (error) {
      // Limpa tokens em caso de erro
      TokenService.clearAll();
      throw error;
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = TokenService.getRefreshToken();
      if (refreshToken) {
        await this.post(`${this.baseUrl}/logout`, { refresh: refreshToken });
      }
    } finally {
      TokenService.clearAll();
    }
  }

  /**
   * Atualiza o token de acesso
   */
  async refreshToken(refresh: string): Promise<TokenResponse> {
    try {
      const response = await this.post<TokenResponse>(`${this.baseUrl}/token/refresh`, {
        refresh
      });

      // Atualiza apenas o token de acesso
      TokenService.setAccessToken(response.access);
      
      return response;
    } catch (error) {
      TokenService.clearAll();
      throw error;
    }
  }

  /**
   * Valida o token atual
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      await this.post(`${this.baseUrl}/token/verify`, { token });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtém o usuário atual
   */
  async getCurrentUser(): Promise<AuthUser> {
    return this.get<AuthUser>(`${this.baseUrl}/me`);
  }

  /**
   * Atualiza senha do usuário
   */
  async updatePassword(data: {
    current_password: string;
    new_password: string;
  }): Promise<ApiResponse> {
    return this.post(`${this.baseUrl}/password`, data);
  }

  /**
   * Solicita redefinição de senha
   */
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    return this.post(`${this.baseUrl}/password/reset`, { email });
  }

  /**
   * Redefine a senha com token
   */
  async resetPassword(data: {
    token: string;
    new_password: string;
  }): Promise<ApiResponse> {
    return this.post(`${this.baseUrl}/password/reset/confirm`, data);
  }

  /**
   * Verifica o estado da autenticação
   */
  async checkAuth(): Promise<boolean> {
    try {
      const accessToken = TokenService.getAccessToken();
      const refreshToken = TokenService.getRefreshToken();

      if (!accessToken || !refreshToken) {
        return false;
      }

      // Tenta validar o token atual
      const isValid = await this.validateToken(accessToken);
      if (isValid) {
        return true;
      }

      // Se o token não é válido, tenta refresh
      await this.refreshToken(refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Inicializa o estado de autenticação
   */
  async initializeAuth(): Promise<AuthState> {
    try {
      const isAuthenticated = await this.checkAuth();
      if (!isAuthenticated) {
        return {
          isAuthenticated: false,
          user: null,
          loading: false
        };
      }

      const user = await this.getCurrentUser();
      return {
        isAuthenticated: true,
        user,
        company_id: user.company_id,
        loading: false
      };
    } catch {
      return {
        isAuthenticated: false,
        user: null,
        loading: false
      };
    }
  }
}

export const authService = new AuthApiService();
export default AuthApiService;