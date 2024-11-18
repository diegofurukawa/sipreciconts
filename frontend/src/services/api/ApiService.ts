// src/services/api/ApiService.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { TokenService, UserSessionService, useAuth } from '@/core/auth';
import { errorUtils, retryUtils } from './utils';
import { API_CONFIG } from './constants';
import type { 
  ApiError, 
  ApiConfig, 
  CustomRequestHeaders, 
  PaginatedResponse,
  ApiResponse 
} from './types';

class ApiService {
  protected api: AxiosInstance;
  protected companyId: number | null = null;

  constructor(config: Partial<ApiConfig> = {}) {
    const mergedConfig = { 
      ...API_CONFIG,
      ...config
    };
    
    this.api = axios.create(mergedConfig);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Cria um objeto AxiosHeaders para garantir tipagem correta
        const headers = new AxiosHeaders(config.headers);

        // Adiciona headers base
        const baseHeaders = this.getHeaders();
        Object.keys(baseHeaders).forEach(key => {
          headers.set(key, baseHeaders[key]);
        });

        // Adiciona Authorization se existir token
        const token = TokenService.getAccessToken();
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }

        // Adiciona session_id se existir
        const session = UserSessionService.load();
        if (session?.sessionId) {
          headers.set('X-Session-ID', session.sessionId);
        }

        // Adiciona company_id se existir
        if (this.companyId) {
          headers.set('X-Company-ID', this.companyId.toString());
        }

        // Debug log para verificar headers
        console.debug('Request Headers:', {
          Authorization: headers.get('Authorization'),
          'X-Session-ID': headers.get('X-Session-ID'),
          'X-Company-ID': headers.get('X-Company-ID')
        });

        // Atualiza os headers da config
        config.headers = headers;
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const session = UserSessionService.load();
            const refreshToken = TokenService.getRefreshToken();

            if (refreshToken && session) {
              const response = await this.api.post('/auth/refresh/', {
                refresh: refreshToken,
                session_id: session.sessionId
              });
              
              const { access } = response.data;
              TokenService.setAccessToken(access);
              session.updateTokens(access, refreshToken);
              
              // Atualiza o header com o novo token
              if (originalRequest.headers instanceof AxiosHeaders) {
                originalRequest.headers.set('Authorization', `Bearer ${access}`);
              } else {
                originalRequest.headers = new AxiosHeaders({
                  ...originalRequest.headers,
                  Authorization: `Bearer ${access}`
                });
              }
              
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            TokenService.clearAll();
            UserSessionService.clear();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Setup retry
    retryUtils.setupRetry(this.api);
  }

  // Headers management
  protected getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    const token = TokenService.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const session = UserSessionService.load();
    if (session?.sessionId) {
      headers['X-Session-ID'] = session.sessionId;
    }

    if (this.companyId) {
      headers['X-Company-ID'] = this.companyId.toString();
    }

    return headers;
  }

  protected getBlobHeaders(format?: 'csv' | 'xlsx'): Record<string, string> {
    return {
      ...this.getHeaders(),
      'Accept': format === 'xlsx'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv',
      'Content-Type': 'application/json'
    };
  }

  // Public methods
  setCompanyId(id: number | null): void {
    this.companyId = id;
    
    // Atualiza o company_id na sessão
    const session = UserSessionService.load();
    if (session && id) {
      session.switchCompany(id);
    }

    if (this.api.defaults.headers instanceof AxiosHeaders) {
      if (id) {
        this.api.defaults.headers.set('X-Company-ID', id.toString());
      } else {
        this.api.defaults.headers.delete('X-Company-ID');
      }
    }
  }

  // Debug method
  async testRequest(): Promise<void> {
    try {
      const headers = this.getHeaders();
      console.group('API Request Test');
      console.log('Headers:', headers);
      console.log('Token:', TokenService.getAccessToken());
      console.log('Session:', UserSessionService.load());
      console.groupEnd();
    } catch (error) {
      console.error('Test Request Error:', error);
    }
  }

  // Protected request methods
  protected async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const headers = new AxiosHeaders({
        ...this.getHeaders(),
        ...config.headers
      });

      const response = await this.api.request<T>({
        ...config,
        headers
      });
      
      return response.data;
    } catch (error) {
      throw errorUtils.handleApiError(error);
    }
  }

  // ... (rest of the methods remain the same)
  protected async get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'GET',
      url,
      params,
    });
  }

  protected async post<T = any>(
    url: string,
    data?: any,
    config?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data,
    });
  }

  protected async put<T = any>(
    url: string,
    data?: any,
    config?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'PUT',
      url,
      data,
    });
  }

  protected async patch<T = any>(
    url: string,
    data?: any,
    config?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'PATCH',
      url,
      data,
    });
  }

  protected async delete<T = any>(
    url: string,
    config?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'DELETE',
      url,
    });
  }

  protected async getPaginated<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: Partial<AxiosRequestConfig>
  ): Promise<PaginatedResponse<T>> {
    return this.get<PaginatedResponse<T>>(url, params, config);
  }

  protected async uploadFile(
    url: string,
    file: File,
    onProgress?: (percentage: number) => void,
    config?: Partial<AxiosRequestConfig>
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new AxiosHeaders({
      ...this.getHeaders(),
      'Content-Type': 'multipart/form-data',
    });

    return this.post<ApiResponse>(url, formData, {
      ...config,
      headers,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      },
    });
  }

  protected async downloadFile(
    url: string,
    filename: string,
    format?: 'csv' | 'xlsx',
    config?: Partial<AxiosRequestConfig>
  ): Promise<Blob> {
    const response = await this.api.get(url, {
      ...config,
      responseType: 'blob',
      headers: new AxiosHeaders(this.getBlobHeaders(format))
    });

    return response.data;
  }

  protected async downloadAndSaveFile(
    url: string,
    filename: string,
    format?: 'csv' | 'xlsx',
    config?: Partial<AxiosRequestConfig>
  ): Promise<void> {
    const blob = await this.downloadFile(url, filename, format, config);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }
}

export const apiService = new ApiService();

export const createApiService = (config?: Partial<ApiConfig>) => {
  return new ApiService(config);
};

export {
  ApiService
};