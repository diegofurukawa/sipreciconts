import { AuthTokens } from './types';

export const TokenService = {
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },

  setTokens({ access, refresh }: AuthTokens): void {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  hasValidToken(): boolean {
    return !!this.getAccessToken();
  }
};