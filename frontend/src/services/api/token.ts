// src/services/api/token.ts
import { Auth } from './types';

interface StorageKeys {
  readonly ACCESS: string;
  readonly REFRESH: string;
  readonly USER: string;
}

const STORAGE_KEYS: StorageKeys = {
  ACCESS: '@SiPreciConts:accessToken',
  REFRESH: '@SiPreciConts:refreshToken',
  USER: '@SiPreciConts:user'
} as const;

export const TokenService = {
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
      const response = await fetch('/api/auth/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      if (data.access) {
        this.setAccessToken(data.access);
        return data.access;
      }

      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
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
      return expirationDate > new Date();
    } catch {
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
    } catch {
      return null;
    }
  },

  /**
   * Validação de token
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/token/verify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      return response.ok;
    } catch {
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

    return {
      isAuthenticated: this.hasValidAccessToken(),
      token: tokens?.access,
      expiration,
      user
    };
  },

  /**
   * Inicialização do serviço
   */
  initialize(): Auth.AuthStatus {
    try {
      return this.getAuthState();
    } catch (error) {
      console.error('Error initializing TokenService:', error);
      this.clearAll();
      return {
        isAuthenticated: false,
        token: undefined,
        expiration: undefined,
        user: undefined
      };
    }
  }
};

export default TokenService;