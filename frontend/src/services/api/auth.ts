// src/services/api/auth.ts
import { api } from './base';
import { TokenService } from './token';
import { Auth, ApiError } from './types';
import { handleApiError } from './utils';

export const AuthService = {
  async login(credentials: Auth.Credentials): Promise<Auth.LoginResponse> {
    try {
      const response = await api.post<Auth.LoginResponse>('auth/login/', credentials);
      const { access, refresh, user } = response.data;
      
      // Store tokens
      TokenService.setTokens({ access, refresh });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = TokenService.getRefreshToken();
      if (refreshToken) {
        // Optionally blacklist the token on the server
        await api.post('auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      TokenService.clearTokens();
    }
  },

  async refreshToken(refresh_token: string): Promise<{ access: string }> {
    try {
      const response = await api.post<{ access: string }>('auth/refresh/', {
        refresh: refresh_token
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      const token = TokenService.getAccessToken();
      if (!token) return false;

      await api.post('auth/verify/', { token });
      return true;
    } catch (error) {
      return false;
    }
  }
};
