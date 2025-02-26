// src/services/api/token.ts
import { Auth } from '../../../types';

interface StorageKeys {
  readonly ACCESS: string;
  readonly REFRESH: string;
  readonly USER: string;
  readonly SESSION_ID: string;
}

const STORAGE_KEYS: StorageKeys = {
  ACCESS: '@SiPreciConts:accessToken',
  REFRESH: '@SiPreciConts:refreshToken',
  USER: '@SiPreciConts:user',
  SESSION_ID: '@SiPreciConts:sessionId'
} as const;

const TokenService = {
  /**
   * Gerenciamento de Access Token
   */
  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS, token);
  },

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS);
  },

  /**
   * Gerenciamento de Refresh Token
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH, token);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH);
  },

  /**
   * Gerenciamento de Session ID
   */
  setSessionId(sessionId: string): void {
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  },

  getSessionId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  },

  /**
   * Gerenciamento conjunto dos tokens
   */
  setTokens({ access, refresh }: Auth.TokenData): void {
    this.setAccessToken(access);
    this.setRefreshToken(refresh);
  },

  getTokens(): Auth.TokenData | null {
    const access = this.getAccessToken();
    const refresh = this.getRefreshToken();

    if (!access || !refresh) return null;

    return { access, refresh };
  },

  /**
   * Renovação de token
   * @param refreshToken Token de refresh para obter novo access token
   * @returns Promise com novo access token ou null em caso de erro
   */
  async getNewToken(refreshToken: string): Promise<string | null> {
    try {
      console.log('Tentando renovar token com refresh token'); // Para debug
      
      const sessionId = this.getSessionId();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Adicionar session_id ao header se disponível
      if (sessionId) {
        headers['X-Session-ID'] = sessionId;
      }
      
      const response = await fetch('/api/auth/refresh/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        console.error('Falha ao atualizar token:', response.status, response.statusText);
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      if (data.access) {
        console.log('Token renovado com sucesso'); // Para debug
        this.setAccessToken(data.access);
        
        // Se o backend retornar um novo refresh token, atualizá-lo também
        if (data.refresh) {
          this.setRefreshToken(data.refresh);
        }
        
        return data.access;
      }

      console.error('Resposta do refresh não contém token de acesso', data);
      return null;
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      return null;
    }
  },

  /**
   * Operações com os dados do usuário
   */
  setUserData(user: Auth.UserData): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUserData(): Auth.UserData | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Operações de limpeza e verificação
   */
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Adicionalmente, vamos limpar outros possíveis dados relacionados à autenticação
    localStorage.removeItem('user');
    localStorage.removeItem('session_id');
    
    // Limpar também possíveis itens de sessão
    sessionStorage.removeItem('currentPath');
    
    console.log('Todos os dados de autenticação foram limpos');
  },

  hasValidAccessToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      // Decodifica o token JWT para verificar a expiração
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      
      if (!decodedPayload.exp) return false;

      // Verifica se o token não expirou
      const expirationDate = new Date(decodedPayload.exp * 1000);
      const currentDate = new Date();
      
      // Adiciona um buffer de 30 segundos para prevenir edge cases
      const isValid = expirationDate.getTime() > (currentDate.getTime() + 30000);
      
      // Log para debug
      console.log('Verificação de token:', {
        expira: expirationDate.toISOString(),
        agora: currentDate.toISOString(),
        válido: isValid,
        tempoRestante: Math.floor((expirationDate.getTime() - currentDate.getTime()) / 1000) + 's'
      });
      
      return isValid;
    } catch (error) {
      console.error('Erro ao verificar validade do token:', error);
      return false;
    }
  },

  hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  },

  /**
   * Métodos utilitários
   */
  getAuthorizationHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  },

  getTokenExpiration(): Date | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      
      if (!decodedPayload.exp) return null;

      return new Date(decodedPayload.exp * 1000);
    } catch (error) {
      console.error('Erro ao obter expiração do token:', error);
      return null;
    }
  },

  /**
   * Validação de token
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      console.log('Validando token...');
      
      const sessionId = this.getSessionId();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Adicionar session_id ao header se disponível
      if (sessionId) {
        headers['X-Session-ID'] = sessionId;
      }
      
      const response = await fetch('/api/auth/validate/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ token }),
      });

      const isValid = response.ok;
      console.log('Token validado:', isValid);
      
      return isValid;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  },

  /**
   * Estado completo da autenticação
   */
  getAuthState(): Auth.AuthStatus {
    const tokens = this.getTokens();
    const user = this.getUserData();
    const expiration = this.getTokenExpiration();
    const sessionId = this.getSessionId();

    return {
      isAuthenticated: this.hasValidAccessToken(),
      token: tokens?.access,
      refresh: tokens?.refresh,
      expiration,
      user,
      sessionId
    };
  },

  /**
   * Inicialização do serviço
   */
  initialize(): Auth.AuthStatus {
    try {
      const state = this.getAuthState();
      console.log('TokenService inicializado:', {
        autenticado: state.isAuthenticated,
        temToken: !!state.token,
        temUsuario: !!state.user,
        temSessao: !!state.sessionId
      });
      return state;
    } catch (error) {
      console.error('Error initializing TokenService:', error);
      this.clearAll();
      return {
        isAuthenticated: false,
        token: undefined,
        refresh: undefined,
        expiration: undefined,
        user: undefined,
        sessionId: undefined
      };
    }
  },

  /**
   * Tenta renovar o token atual usando o refresh token armazenado
   * @returns Promise<boolean> indicando se a renovação foi bem-sucedida
   */
  async refreshCurrentToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        console.warn('Tentativa de refresh sem refresh token');
        return false;
      }
      
      const newToken = await this.getNewToken(refreshToken);
      return !!newToken;
    } catch (error) {
      console.error('Erro ao renovar token atual:', error);
      return false;
    }
  },

  /**
   * Verifica se o token está próximo de expirar (menos de 5 minutos)
   * e o renova se necessário
   */
  async checkAndRenewTokenIfNeeded(): Promise<boolean> {
    try {
      const expiration = this.getTokenExpiration();
      if (!expiration) return false;
      
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
      
      // Se o token expira em menos de 5 minutos, tenta renovar
      if (expiration <= fiveMinutesFromNow) {
        console.log('Token próximo de expirar, renovando...');
        return await this.refreshCurrentToken();
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar expiração do token:', error);
      return false;
    }
  }
};

export {TokenService};