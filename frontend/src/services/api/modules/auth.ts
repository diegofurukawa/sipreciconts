// src/services/api/modules/auth.ts
import { ApiService } from '../ApiService';
import { TokenService, UserSessionService, useAuth } from '@/core/auth';
import type { ApiResponse } from '../types';

// Enum para códigos de erro
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'CREDENCIAIS_INVALIDAS',
  SERVER_ERROR = 'ERRO_SERVIDOR',
  NETWORK_ERROR = 'ERRO_CONEXAO',
  SESSION_EXPIRED = 'SESSAO_EXPIRADA'
}

// Interface para erro customizado
export class AuthenticationError extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Interfaces
export interface AuthCredentials {
  login: string;
  password: string;
}

export interface AuthUser {
  id: number;
  login: string;
  user_name: string;
  name: string;
  email: string;
  type: string;
  company_id: string;
  company_name?: string;
  last_login?: string;
}

export interface AuthResponse {
  user: AuthUser;
  access: string;
  refresh: string;
  session_id: string;
  expires_in: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  company_id?: string;
  loading: boolean;
  session_id?: string;
}

export interface TokenResponse {
  access: string;
  refresh?: string;
}

class AuthApiService extends ApiService {
  private readonly baseUrl = '/auth';

  /**
   * Inicializa o estado de autenticação
   */
  async initializeAuth(): Promise<AuthState> {
    try {
      const token = TokenService.getAccessToken();
      const session = UserSessionService.load();

      if (!token || !session) {
        return {
          isAuthenticated: false,
          user: null,
          loading: false
        };
      }

      try {
        const isValid = await this.validate();

        if (!isValid) {
          this.clearAuthData();
          return {
            isAuthenticated: false,
            user: null,
            loading: false
          };
        }

        return {
          isAuthenticated: true,
          user: session.user || null,
          company_id: session.companyId,
          session_id: session.sessionId,
          loading: false
        };

      } catch (error) {
        this.clearAuthData();
        throw error;
      }

    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
      return {
        isAuthenticated: false,
        user: null,
        loading: false
      };
    }
  }

  /**
   * Realiza o login do usuário
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await this.post<AuthResponse>(`${this.baseUrl}/login/`, {
        login: credentials.login,
        password: credentials.password
      });

      if (!response || !response.access || !response.user) {
        throw new AuthenticationError(
          AuthErrorCode.SERVER_ERROR,
          'Resposta de autenticação incompleta'
        );
      }

      const normalizedUser = {
        ...response.user,
        name: response.user.user_name
      };

      this.setupAuthData(response, normalizedUser);

      return {
        ...response,
        user: normalizedUser
      };

    } catch (error: any) {
      this.clearAuthData();
      
      if (error.response) {
        throw new AuthenticationError(
          AuthErrorCode.INVALID_CREDENTIALS,
          error.response.data?.detail || 'Erro de autenticação',
          error.response.data
        );
      }

      throw new AuthenticationError(
        AuthErrorCode.SERVER_ERROR,
        'Erro ao realizar login',
        error
      );
    }
  }

  /**
   * Realiza o logout do usuário
   */
  async logout(): Promise<void> {
    try {
      const token = TokenService.getAccessToken();
      const session = UserSessionService.load();

      if (token && session) {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'X-Session-ID': session.sessionId
        };

        await this.post(`${this.baseUrl}/logout/`, null, { headers });
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      this.clearAuthData();
      window.location.href = '/login';
    }
  }

  /**
   * Valida o token atual
   */
  async validate(): Promise<boolean> {
    try {
      const token = TokenService.getAccessToken();
      const session = UserSessionService.load();

      if (!token || !session) {
        return false;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'X-Session-ID': session.sessionId
      };

      await this.post(`${this.baseUrl}/validate/`, null, { headers });
      return true;
    } catch (error) {
      if (error instanceof AuthenticationError && error.code === AuthErrorCode.SESSION_EXPIRED) {
        await this.handleSessionExpired();
      }
      return false;
    }
  }

  /**
   * Atualiza o token expirado
   */
  async refreshToken(refresh: string): Promise<string> {
    try {
      const session = UserSessionService.load();
      
      const headers = {
        'X-Session-ID': session?.sessionId || ''
      };

      const response = await this.post<TokenResponse>(
        `${this.baseUrl}/refresh/`,
        { refresh },
        { headers }
      );

      const newToken = response.access;

      if (session) {
        session.updateTokens(newToken, refresh);
        
        this.setAuthHeaders({
          token: newToken,
          companyId: session.companyId,
          sessionId: session.sessionId
        });
      }

      return newToken;
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = TokenService.getAccessToken();
    const session = UserSessionService.load();
    return !!token && !!session?.isActive;
  }

  /**
   * Obtém o usuário atual
   */
  getCurrentUser(): AuthUser | null {
    const session = UserSessionService.load();
    return session?.user || null;
  }

  /**
   * Atualiza os dados do usuário
   */
  async updateUserData(userData: Partial<AuthUser>): Promise<void> {
    const session = UserSessionService.load();
    if (session) {
      session.updateUser(userData);
    }
  }

  /**
   * Verifica e renova o token se necessário
   */
  async checkAndRenewToken(): Promise<boolean> {
    const token = TokenService.getAccessToken();
    const refresh = TokenService.getRefreshToken();
    const session = UserSessionService.load();

    if (!token || !refresh || !session) {
      return false;
    }

    try {
      const isValid = await this.validate();
      if (!isValid && refresh) {
        await this.refreshToken(refresh);
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Trata expiração da sessão
   */
  private async handleSessionExpired(): Promise<void> {
    this.clearAuthData();
    window.location.href = '/login?session=expired';
  }

  /**
   * Configura dados de autenticação
   */
  private setupAuthData(response: AuthResponse, user: AuthUser): void {
    TokenService.setTokens({
      access: response.access,
      refresh: response.refresh
    });

    this.setAuthHeaders({
      token: response.access,
      companyId: user.company_id,
      sessionId: response.session_id
    });

    UserSessionService.createFromAuth({
      session_id: response.session_id,
      user_id: user.id,
      company_id: user.company_id,
      token: response.access,
      refresh_token: response.refresh,
      expires_in: response.expires_in,
      user
    });
  }

  /**
   * Define os headers de autenticação
   */
  private setAuthHeaders(params: {
    token: string;
    companyId: string;
    sessionId: string;
  }): void {
    const { token, companyId, sessionId } = params;
    
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    this.api.defaults.headers.common['X-Session-ID'] = sessionId;
    
    if (!this.isAuthRoute(this.api.defaults.url || '')) {
      this.api.defaults.headers.common['X-Company-ID'] = companyId;
    }
  }

  /**
   * Verifica se é uma rota de autenticação
   */
  private isAuthRoute(url: string): boolean {
    const authRoutes = ['/auth/login', '/auth/logout', '/auth/refresh', '/auth/validate'];
    return authRoutes.some(route => url.includes(route));
  }

  /**
   * Limpa todos os dados de autenticação
   */
  private clearAuthData(): void {
    TokenService.clearAll();
    UserSessionService.clear();
    
    delete this.api.defaults.headers.common['Authorization'];
    delete this.api.defaults.headers.common['X-Company-ID'];
    delete this.api.defaults.headers.common['X-Session-ID'];
  }
}

export const authService = new AuthApiService();
export default AuthApiService;