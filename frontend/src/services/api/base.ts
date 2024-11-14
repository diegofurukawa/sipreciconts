// src/services/api/base.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenService } from './token';
import { ApiError, ApiConfig, CustomRequestHeaders, RetryOptions } from './types';

const DEFAULT_CONFIG: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  retryAttempts: 3,
  retryDelay: 1000
};

const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

export class BaseApiService {
  protected api: AxiosInstance;
  protected companyId: number | null = null;

  constructor(config: Partial<ApiConfig> = {}) {
    // Merge default config with provided config
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    
    // Create axios instance
    this.api = axios.create(mergedConfig);
    
    // Setup interceptors
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add authorization header if token exists
        const token = TokenService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add company ID header if set
        if (this.companyId) {
          config.headers['X-Company-ID'] = this.companyId.toString();
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
        
        // Handle 401 and token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = TokenService.getRefreshToken();
            if (refreshToken) {
              const response = await this.api.post('/refresh/', {
                refresh: refreshToken,
              });
              
              const { access } = response.data;
              TokenService.setAccessToken(access);
              
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            TokenService.clearAll();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle retry for specific status codes
        if (
          RETRY_STATUS_CODES.includes(error.response?.status || 0) &&
          (!originalRequest._retryCount || originalRequest._retryCount < DEFAULT_CONFIG.retryAttempts!)
        ) {
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
          
          const delay = this.getRetryDelay(originalRequest._retryCount);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return this.api(originalRequest);
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private getRetryDelay(retryCount: number): number {
    // Exponential backoff with jitter
    const baseDelay = DEFAULT_CONFIG.retryDelay!;
    const exponentialDelay = baseDelay * Math.pow(2, retryCount - 1);
    const jitter = Math.random() * 100;
    return exponentialDelay + jitter;
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      return new ApiError({
        message: data?.message || 'An error occurred',
        code: this.getErrorCode(status),
        details: data?.details,
        status
      });
    }

    if (error.request) {
      return new ApiError({
        code: 'NETWORK_ERROR',
        message: 'Network error occurred',
        status: 0
      });
    }

    return new ApiError({
      code: 'SERVER_ERROR',
      message: error.message || 'Unknown error occurred',
      status: 500
    });
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 422: return 'VALIDATION_ERROR';
      default: return 'SERVER_ERROR';
    }
  }

  // Public methods
  setCompanyId(id: number | null): void {
    this.companyId = id;
    if (id) {
      this.api.defaults.headers['X-Company-ID'] = id.toString();
    } else {
      delete this.api.defaults.headers['X-Company-ID'];
    }
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  protected getHeaders(): CustomRequestHeaders {
    const headers: CustomRequestHeaders = {};
    
    if (this.companyId) {
      headers['X-Company-ID'] = this.companyId.toString();
    }
    
    return headers;
  }
}

// Export a default instance for backward compatibility
export const api = new BaseApiService().setCompanyId;