// src/services/api/modules/auth.ts
import { ApiService } from '../ApiService';
import { TokenService } from '../token';
import type { ApiResponse } from '../types';

// Types
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
  session_id: string;
}

export interface TokenResponse {
  access: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  company_id?: number;
  loading: boolean;
  session_id?: string;
}

export interface UserSession {
  id?: number;
  user_id: number;
  company_id: number;
  session_id: string;
  token: string;
  ip_address?: string;
  user_agent?: string;
  started_at: Date;
  last_activity_at: Date;
  ended_at?: Date;
}

class AuthApiService extends ApiService {
  private readonly baseUrl = '/auth';

  /**
   * Realiza login do usuário
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      // 1. Faz login e obtém tokens
      const response = await this.post<AuthResponse>(`${this.baseUrl}/login/`, credentials);
      
      // 2. Armazena tokens
      TokenService.setTokens({
        access: response.access,
        refresh: response.refresh
      });

      // 3. Configura token no header para todas as requisições futuras
      this.api.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;
      
      // 4. Registra sessão do usuário
      await this.createUserSession({
        user_id: response.user.id,
        company_id: response.user.company_id,
        session_id: response.session_id,
        token: response.access,
        started_at: new Date(),
        last_activity_at: new Date()
      });

      return response;
    } catch (error) {
      // Limpa dados em caso de erro
      TokenService.clearAll();
      delete this.api.defaults.headers.common['Authorization'];
      throw error;
    }
  }

  /**
   * Cria registro de sessão do usuário
   */
  private async createUserSession(session: Omit<UserSession, 'id'>): Promise<UserSession> {
    return this.post<UserSession>(`${this.baseUrl}/sessions/`, {
      ...session,
      ip_address: window.location.hostname,
      user_agent: navigator.userAgent
    });
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      const token = TokenService.getAccessToken();
      const sessionId = localStorage.getItem('session_id');

      if (token && sessionId) {
        // Finaliza a sessão no backend
        await this.post(`${this.baseUrl}/logout/`, {
          token,
          session_id: sessionId,
          ended_at: new Date()
        });
      }
    } finally {
      // Limpa dados locais
      TokenService.clearAll();
      localStorage.removeItem('session_id');
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Atualiza o token de acesso
   */
  async refreshToken(refresh: string): Promise<TokenResponse> {
    try {
      const sessionId = localStorage.getItem('session_id');
      const response = await this.post<TokenResponse>(`${this.baseUrl}/refresh/`, {
        refresh,
        session_id: sessionId
      });

      // Atualiza token
      TokenService.setAccessToken(response.access);
      this.api.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;
      
      return response;
    } catch (error) {
      TokenService.clearAll();
      localStorage.removeItem('session_id');
      delete this.api.defaults.headers.common['Authorization'];
      throw error;
    }
  }

  /**
   * Valida o token atual
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const sessionId = localStorage.getItem('session_id');
      await this.post(`${this.baseUrl}/token/verify/`, { 
        token,
        session_id: sessionId
      });
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
    return this.post(`${this.baseUrl}/password/`, data);
  }

  /**
   * Solicita redefinição de senha
   */
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    return this.post(`${this.baseUrl}/password/reset/`, { email });
  }

  /**
   * Redefine a senha com token
   */
  async resetPassword(data: {
    token: string;
    new_password: string;
  }): Promise<ApiResponse> {
    return this.post(`${this.baseUrl}/password/reset/confirm/`, data);
  }

  /**
   * Lista sessões ativas do usuário
   */
  async getActiveSessions(): Promise<Array<{
    session_id: string;
    created_at: string;
    user_agent?: string;
    ip_address?: string;
    is_current: boolean;
  }>> {
    return this.get(`${this.baseUrl}/sessions/active/`);
  }

  /**
   * Encerra outras sessões ativas
   */
  async endOtherSessions(): Promise<void> {
    const currentSessionId = localStorage.getItem('session_id');
    if (currentSessionId) {
      await this.post(`${this.baseUrl}/sessions/end-others/`, {
        current_session_id: currentSessionId
      });
    }
  }

  /**
   * Verifica o estado da autenticação
   */
  async checkAuth(): Promise<boolean> {
    try {
      const token = TokenService.getAccessToken();
      const sessionId = localStorage.getItem('session_id');

      if (!token || !sessionId) {
        return false;
      }

      // Valida token atual
      const isValid = await this.validateToken(token);
      if (!isValid) {
        // Tenta refresh
        const refreshToken = TokenService.getRefreshToken();
        if (refreshToken) {
          await this.refreshToken(refreshToken);
          return true;
        }
        return false;
      }

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
      const sessionId = localStorage.getItem('session_id');

      return {
        isAuthenticated: true,
        user,
        company_id: user.company_id,
        session_id: sessionId || undefined,
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

  /**
   * Troca a empresa do usuário
   */
  async switchCompany(companyId: number): Promise<void> {
    const sessionId = localStorage.getItem('session_id');
    if (sessionId) {
      await this.post(`${this.baseUrl}/switch-company/`, {
        company_id: companyId,
        session_id: sessionId
      });
    }
  }
}

// Exporta instância única do serviço
export const authService = new AuthApiService();

// Exporta classe para casos específicos
export default AuthApiService;