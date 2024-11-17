// src/services/api/modules/auth.ts
import { ApiService } from '../ApiService';
import { TokenService } from '../token';
import { UserSession } from '../UserSession';
import type { ApiResponse } from '../types';

// Enum para códigos de erro
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'CREDENCIAIS_INVALIDAS',
  SERVER_ERROR = 'ERRO_SERVIDOR',
  NETWORK_ERROR = 'ERRO_CONEXAO'
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

      TokenService.setTokens({
        access: response.access,
        refresh: response.refresh
      });

      this.setAuthHeaders({
        token: response.access,
        companyId: normalizedUser.company_id,
        sessionId: response.session_id
      });

      UserSession.createFromAuth({
        session_id: response.session_id,
        user_id: normalizedUser.id,
        company_id: normalizedUser.company_id,
        token: response.access,
        refresh_token: response.refresh,
        expires_in: response.expires_in,
        user: normalizedUser
      });

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
      const session = UserSession.load();

      if (token && session) {
        await this.post(`${this.baseUrl}/logout/`, null, {
          headers: this.getAuthHeaders(token, session)
        });
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
      const session = UserSession.load();

      if (!token || !session) {
        return false;
      }

      await this.post(`${this.baseUrl}/validate/`, null, {
        headers: this.getAuthHeaders(token, session)
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Atualiza o token expirado
   */
  async refreshToken(refresh: string): Promise<string> {
    try {
      const session = UserSession.load();
      
      const response = await this.post<TokenResponse>(`${this.baseUrl}/refresh/`, {
        refresh,
        session_id: session?.sessionId
      });

      const newToken = response.access;

      if (session) {
        this.setAuthHeaders({
          token: newToken,
          companyId: session.companyId,
          sessionId: session.sessionId
        });
        session.updateTokens(newToken, refresh);
      }

      return newToken;
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Inicializa o estado de autenticação
   */
  async initializeAuth(): Promise<AuthState> {
    try {
      const isAuthenticated = await this.validate();
      
      if (!isAuthenticated) {
        return {
          isAuthenticated: false,
          user: null,
          loading: false
        };
      }

      const session = UserSession.load();
      const user = session?.user || null;

      if (session && user) {
        this.setAuthHeaders({
          token: session.token,
          companyId: session.companyId,
          sessionId: session.sessionId
        });
      }

      return {
        isAuthenticated: true,
        user,
        company_id: session?.companyId,
        session_id: session?.sessionId,
        loading: false
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        user: null,
        loading: false
      };
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return TokenService.hasValidAccessToken() && UserSession.hasActiveSession();
  }

  /**
   * Obtém os headers de autenticação
   */
  private getAuthHeaders(token: string, session: UserSession): Record<string, string> {
    return {
      'Authorization': `Bearer ${token}`,
      'X-Company-ID': session.companyId,
      'X-Session-ID': session.sessionId
    };
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
    this.api.defaults.headers.common['X-Company-ID'] = companyId;
    this.api.defaults.headers.common['X-Session-ID'] = sessionId;
  }

  /**
   * Limpa todos os dados de autenticação
   */
  private clearAuthData(): void {
    TokenService.clearAll();
    UserSession.clear();
    
    delete this.api.defaults.headers.common['Authorization'];
    delete this.api.defaults.headers.common['X-Company-ID'];
    delete this.api.defaults.headers.common['X-Session-ID'];
  }
}

export const authService = new AuthApiService();
export default AuthApiService;