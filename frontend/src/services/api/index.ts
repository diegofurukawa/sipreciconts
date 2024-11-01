// src/services/api/index.ts
import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Trata erro de autenticação
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Exportação default do cliente axios configurado
export default api;

// Interface base para respostas da API
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

// Funções auxiliares para requests comuns
export const apiService = {
  get: async <T>(url: string, params?: object): Promise<ApiResponse<T>> => {
    const response = await api.get(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await api.post(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await api.put(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await api.delete(url);
    return response.data;
  },
};

// Exportar serviços
export { default as axiosInstance } from './base';
export { AuthService } from './auth';
export { getToken, setToken, removeToken, TokenService } from './token';

// export { AuthService } from './auth';
export { CustomerService } from './customer';
export { TaxService } from './tax';

// Exportar utilitários de erro
export {
  handleApiError,
  isAuthError,
  isNetworkError,
  formatErrorMessage,
  handleApiErrorWithCallback
} from './utils';

// Exportar tipos
export type {
  ApiConfig,
  ApiError,
  ApiErrorCode,
  ApiErrorResponse,
  ErrorCallbacks,
  PaginatedResponse,
  AuthStatus
} from './types';

// Exportar tipos de autenticação
export type { 
  AuthResponse, 
  LoginCredentials, 
  User 
} from '../../types/auth.types';