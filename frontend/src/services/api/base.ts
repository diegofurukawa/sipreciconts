// src/services/api/base.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiConfig, APIError, ApiErrorResponse } from './types';

export abstract class BaseApiService {
  protected api: AxiosInstance;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(config: ApiConfig) {
    this.api = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
    });
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000;

    this.setupInterceptors();
  }

  protected getCompanyId(required: boolean = true): string | null {
    const companyId = localStorage.getItem('@App:company_id');
    if (!companyId && required) {
      throw new APIError('Empresa não selecionada', 400, 'COMPANY_ID_MISSING');
    }
    return companyId;
  }

  protected checkAuth() {
    if (!localStorage.getItem('@App:token')) {
      throw new APIError('Usuário não autenticado', 401, 'AUTH_REQUIRED');
    }
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('@App:token');
        if (token) {
          config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        }

        // Adiciona company_id apenas para rotas não-auth
        if (!config.url?.includes('auth/')) {
          try {
            const companyId = this.getCompanyId(!config.url?.includes('auth/'));
            if (companyId) {
              const separator = config.url?.includes('?') ? '&' : '?';
              config.url = `${config.url}${separator}company=${companyId}`;
            }
          } catch (error) {
            if (error instanceof APIError && !config.url?.includes('auth/')) {
              throw error;
            }
          }
        }

        return config;
      },
      (error) => Promise.reject(this.handleError(error))
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (!error.response && originalRequest._retry < this.retryAttempts) {
          originalRequest._retry = (originalRequest._retry || 0) + 1;
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          return this.api(originalRequest);
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
          await this.handleAuthError();
          return Promise.reject(
            new APIError(
              'Sessão expirada. Por favor, faça login novamente.',
              error.response.status,
              'AUTH_ERROR'
            )
          );
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  protected handleError(error: AxiosError): APIError {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (!error.response) {
      return new APIError(
        error.message || 'Erro de conexão com o servidor',
        0,
        'NETWORK_ERROR'
      );
    }

    const responseData = error.response.data as ApiErrorResponse;
    const status = error.response.status;
    const message = this.getErrorMessage(responseData);
    const errorCode = responseData?.code || `HTTP_${status}`;

    return new APIError(message, status, errorCode, responseData);
  }

  private getErrorMessage(data: any): string {
    if (!data) return 'Erro na requisição';
    if (typeof data === 'string') return data;
    if (typeof data === 'object') {
      return data.detail || 
             data.message || 
             data.error || 
             (Array.isArray(data) ? data[0] : null) ||
             JSON.stringify(data);
    }
    return 'Erro na requisição';
  }

  private async handleAuthError() {
    localStorage.removeItem('@App:token');
    localStorage.removeItem('@App:user');
    localStorage.removeItem('@App:company_id');
    window.location.href = '/login';
  }
}