// src/services/api/utils.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import { TokenService } from './token';
import { 
  ApiError, 
  ApiConfig, 
  ApiErrorCode, 
  ApiErrorResponse, 
  ErrorCallbacks,
  RetryConfig,
  RetryOptions,
  RetryState
} from './types';

// Interface estendida para configuração do retry
interface ExtendedRetryConfig extends RetryConfig {
  url?: string;
  headers?: Record<string, string>;
}

/**
 * Default configurations
 */
export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelay: 1000,
  statusCodes: [408, 429, 500, 502, 503, 504]
};

/**
 * API Error Utilities
 */
export const errorUtils = {
  isAuthError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN';
    }
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      return status === 401 || status === 403;
    }
    
    return false;
  },

  isNetworkError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.code === 'NETWORK_ERROR';
    }
    
    if (axios.isAxiosError(error)) {
      return !error.response || error.code === 'ECONNABORTED';
    }
    
    return false;
  },

  formatErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
      if (error.details) {
        const details = Object.entries(error.details)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        return `${error.message}\n${details}`;
      }
      return error.message;
    }
    
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || 
             error.message || 
             'Ocorreu um erro ao processar sua requisição';
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return 'Um erro inesperado ocorreu';
  },

  getErrorCode(status?: number): ApiErrorCode {
    switch (status) {
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 422: return 'VALIDATION_ERROR';
      case undefined: return 'NETWORK_ERROR';
      default: return 'SERVER_ERROR';
    }
  },

  handleApiError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const code = this.getErrorCode(axiosError.response?.status);

      return new ApiError({
        message: axiosError.response?.data?.message || 'Ocorreu um erro ao processar sua requisição',
        code,
        details: axiosError.response?.data?.details,
        status: axiosError.response?.status
      });
    }

    return new ApiError({
      message: error instanceof Error ? error.message : 'Um erro inesperado ocorreu',
      code: 'SERVER_ERROR'
    });
  }
};

/**
 * Retry Utilities
 */
export const retryUtils = {
  calculateDelay(attempt: number, options: RetryOptions): number {
    const baseDelay = options.baseDelay || DEFAULT_RETRY_OPTIONS.baseDelay;
    const jitter = Math.random() * 100;
    return Math.min(
      baseDelay * Math.pow(2, attempt) + jitter,
      30000 // max delay of 30 seconds
    );
  },

  shouldRetry(
    error: any,
    currentAttempt: number,
    options: RetryOptions = DEFAULT_RETRY_OPTIONS
  ): boolean {
    if (currentAttempt >= options.maxAttempts) {
      return false;
    }

    if (!error.response) {
      return true;
    }

    return options.statusCodes.includes(error.response.status);
  },

  setupRetry(
    instance: AxiosInstance,
    options: RetryOptions = DEFAULT_RETRY_OPTIONS
  ): void {
    instance.interceptors.response.use(
      response => response,
      async error => {
        const config = error.config as ExtendedRetryConfig;

        if (!config || config.__isRetry) {
          return Promise.reject(error);
        }

        const currentAttempt = config.__retryCount || 0;

        if (!this.shouldRetry(error, currentAttempt, options)) {
          return Promise.reject(error);
        }

        config.__retryCount = currentAttempt + 1;
        config.__isRetry = true;

        const delay = this.calculateDelay(currentAttempt, options);
        await new Promise(resolve => setTimeout(resolve, delay));

        return instance(config);
      }
    );
  }
};

/**
 * Error Handling with Callbacks
 */
export const handleApiErrorWithCallback = (
  error: unknown,
  callbacks?: ErrorCallbacks
): ApiError => {
  const apiError = errorUtils.handleApiError(error);
  
  if (callbacks) {
    switch (apiError.code) {
      case 'UNAUTHORIZED': callbacks.onUnauthorized?.(); break;
      case 'FORBIDDEN': callbacks.onForbidden?.(); break;
      case 'NOT_FOUND': callbacks.onNotFound?.(); break;
      case 'VALIDATION_ERROR': callbacks.onValidationError?.(apiError.details); break;
      case 'SERVER_ERROR': callbacks.onServerError?.(); break;
      case 'NETWORK_ERROR': callbacks.onNetworkError?.(); break;
      case 'TOKEN_EXPIRED': callbacks.onTokenExpired?.(); break;
      default: callbacks.onDefault?.(apiError);
    }
  }
  
  return apiError;
};

/**
 * Interceptor Setup
 */
export const setupInterceptors = (instance: AxiosInstance): void => {
  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = TokenService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(errorUtils.handleApiError(error))
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedRetryConfig;
      
      if (!originalRequest || originalRequest.__isRetry) {
        return Promise.reject(errorUtils.handleApiError(error));
      }

      if (
        error.response?.status === 401 && 
        originalRequest?.url && 
        !originalRequest.url.endsWith('/auth/refresh/')
      ) {
        try {
          const refreshToken = TokenService.getRefreshToken();
          if (refreshToken) {
            const response = await instance.post('/auth/refresh/', {
              refresh: refreshToken
            });
            
            const { access } = response.data;
            TokenService.setAccessToken(access);
            
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }
            originalRequest.headers.Authorization = `Bearer ${access}`;
            
            return instance(originalRequest);
          }
        } catch (refreshError) {
          TokenService.clearAll();
          window.location.href = '/login';
          return Promise.reject(errorUtils.handleApiError(refreshError));
        }
      }

      return Promise.reject(errorUtils.handleApiError(error));
    }
  );
};

// Exportação do handleApiError separadamente
export const handleApiError = errorUtils.handleApiError;

// Export utilities
export {
  errorUtils as errors,
  retryUtils as retry
};

// Default export
export default {
  errors: errorUtils,
  retry: retryUtils,
  handleApiError,
  handleApiErrorWithCallback,
  setupInterceptors
};