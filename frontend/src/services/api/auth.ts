// src/services/api/auth.ts
import axiosInstance from './base';
import type { LoginResponse, LoginCredentials } from '../../types/auth.types';

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('auth/login/', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('auth/logout/');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  validateToken: async (): Promise<boolean> => {
    try {
      await axiosInstance.post('auth/validate-token/');
      return true;
    } catch {
      return false;
    }
  }
};

// src/services/api/token.ts
export const getToken = () => localStorage.getItem('token');

export const setToken = (token: string) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');