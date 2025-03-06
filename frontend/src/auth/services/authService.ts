// src/services/modules/auth.ts
import { useNavigate } from 'react-router-dom';
import { ApiService } from '@/services/apiMainService';
import { TokenService, UserSessionService } from "@/auth/services";
import type { AuthUser } from '../types/auth_types';

// Enum para códigos de erro
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'CREDENCIAIS_INVALIDAS',
  SERVER_ERROR = 'ERRO_SERVIDOR',
  NETWORK_ERROR = 'ERRO_CONEXAO',
  SESSION_EXPIRED = 'SESSAO_EXPIRADA',
  TOKEN_INVALID = 'TOKEN_INVALIDO'
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

export interface ValidateResponse {
  is_valid: boolean;
  detail?: string;
  code?: string;
  messages?: Array<{
    token_class: string;
    token_type: string;
    message: string;
  }>;
}

// const navigate = useNavigate();

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

        // Determinar se está autenticado com base no token e sessão
        const isAuthenticated = !!token && !!session?.isActive;
        
        return {
          isAuthenticated,
          user: session?.user || null,
          company_id: session?.companyId || undefined,
          session_id: session?.sessionId,
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
        login: credentials.login, // Alterado para login conforme backend espera
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
      // navigate('/login');
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
        await this.handleInvalidToken();
        return false;
      }

      // Configura os headers para a validação
      this.setAuthHeaders({
        token,
        companyId: session.companyId,
        sessionId: session.sessionId
      });

      try {
        const response = await this.post<ValidateResponse>(`${this.baseUrl}/validate/`);

        // Verifica se o token é inválido
        if (response.code === 'token_not_valid' || !response.is_valid) {
          await this.handleInvalidToken(response.detail);
          return false;
        }

        return response.is_valid === true;

      } catch (error: any) {
        // Trata erro específico de token inválido
        if (error.response?.data?.code === 'token_not_valid') {
          await this.handleInvalidToken(error.response?.data?.detail);
          return false;
        }

        // Trata erro de autorização
        if (error.response?.status === 401) {
          await this.handleInvalidToken('Sessão expirada');
          return false;
        }

        throw new AuthenticationError(
          AuthErrorCode.TOKEN_INVALID,
          error.response?.data?.detail || 'Token inválido',
          error.response?.data
        );
      }

    } catch (error) {
      console.error('Erro na validação do token:', error);
      await this.handleInvalidToken();
      return false;
    }
  }

  /**
   * Atualiza o token expirado
   */
  async refreshToken(refresh: string): Promise<string> {
    try {
      const session = UserSessionService.load();
      
      if (session) {
        this.setAuthHeaders({
          token: refresh,
          companyId: session.companyId,
          sessionId: session.sessionId
        });
      }

      const response = await this.post<TokenResponse>(
        `${this.baseUrl}/refresh/`,
        { refresh }
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
      UserSessionService.save(session);
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
   * Trata token inválido
   */
  private async handleInvalidToken(message?: string): Promise<void> {
    this.clearAuthData();
    
    if (message) {
      console.warn('Token inválido:', message);
    }
    
    const searchParams = new URLSearchParams();
    searchParams.append('session', 'expired');
    if (message) {
      searchParams.append('message', message);
    }
    
    window.location.href = `/login?${searchParams.toString()}`;
  }

  /**
   * Trata expiração da sessão
   */
  private async handleSessionExpired(): Promise<void> {
    this.clearAuthData();
    window.location.href = '/login?session=expired';
    // navigate('/login?session=expired');
  }

  /**
   * Configura dados de autenticação
   */
  private setupAuthData(response: AuthResponse, user: AuthUser): void {
    TokenService.setAccessToken(response.access);
    TokenService.setRefreshToken(response.refresh);

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
    companyId: string | null;
    sessionId: string;
  }): void {
    const { token, companyId, sessionId } = params;
    
    // Garante formato Bearer no token
    this.api.defaults.headers.common['Authorization'] = token.startsWith('Bearer ') 
      ? token 
      : `Bearer ${token}`;
      
    this.api.defaults.headers.common['X-Session-ID'] = sessionId;
    
    if (companyId && !this.isAuthRoute(this.api.defaults.url || '')) {
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