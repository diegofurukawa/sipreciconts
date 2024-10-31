// src/services/api/auth.ts
import { AxiosError } from 'axios';
import { BaseApiService } from './base';
import { APIError } from './types';

export interface AuthResponse {
  token: string;
  user: {
    user_id: number;
    login: string;
    name: string;
    company_id: string;
  };
}

export class AuthService extends BaseApiService {
  async login(login: string, password: string): Promise<AuthResponse> {
    try {
      // Não verifica company_id para login
      const response = await this.api.post<AuthResponse>('/auth/login/', { login, password });
      const { token, user } = response.data;
      
      // Armazenar dados de autenticação
      localStorage.setItem('@App:token', `Bearer ${token}`);
      localStorage.setItem('@App:user', JSON.stringify(user));
      localStorage.setItem('@App:company_id', user.company_id);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof APIError) throw error;
      throw this.handleError(error as AxiosError);
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('@App:token');
      if (token) {
        await this.api.post('/auth/logout/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('@App:token');
    const user = localStorage.getItem('@App:user');
    const companyId = this.getCompanyId(false);
    return !!(token && user && companyId);
  }

  getCurrentUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem('@App:user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  private clearAuth(): void {
    localStorage.removeItem('@App:token');
    localStorage.removeItem('@App:user');
    localStorage.removeItem('@App:company_id');
    window.location.href = '/login';
  }
}