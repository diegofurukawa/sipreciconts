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
  }
};

/**
 * Retry Utilities
 */
export const retryUtils = {
  createRetryDelay(retryState: RetryState): number {
    const { attempt, baseDelay } = retryState;
    const jitter = Math.random() * 100;
    return baseDelay * Math.pow(2, attempt) + jitter;
  },

  shouldRetry(
    error: any,
    retryState: RetryState,
    options: RetryOptions = DEFAULT_RETRY_OPTIONS
  ): boolean {
    if (retryState.attempt >= options.maxAttempts) {
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
        const config = error.config;

        if (!config) {
          return Promise.reject(error);
        }

        const retryState: RetryState = {
          attempt: config.retryAttempt || 0,
          delay: options.baseDelay,
          error
        };

        if (!this.shouldRetry(error, retryState, options)) {
          return Promise.reject(error);
        }

        config.retryAttempt = retryState.attempt + 1;
        const delay = this.createRetryDelay(retryState);

        await new Promise(resolve => setTimeout(resolve, delay));

        return instance(config);
      }
    );
  }
};

/**
 * Configuration Constants
 */
export const DEFAULT_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelay: 1000,
  statusCodes: [408, 429, 500, 502, 503, 504]
};

/**
 * Error Handling Functions
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const code = errorUtils.getErrorCode(axiosError.response?.status);

    return new ApiError({
      message: axiosError.response?.data?.message || 'Ocorreu um erro ao processar sua requisição',
      code,
      details: axiosError.response?.data?.details
    });
  }

  return new ApiError({
    message: error instanceof Error ? error.message : 'Um erro inesperado ocorreu',
    code: 'SERVER_ERROR'
  });
};

export const handleApiErrorWithCallback = (
  error: unknown,
  callbacks?: ErrorCallbacks
): ApiError => {
  const apiError = handleApiError(error);
  
  if (callbacks) {
    switch (apiError.code) {
      case 'UNAUTHORIZED': callbacks.onUnauthorized?.(); break;
      case 'FORBIDDEN': callbacks.onForbidden?.(); break;
      case 'NOT_FOUND': callbacks.onNotFound?.(); break;
      case 'VALIDATION_ERROR': callbacks.onValidationError?.(apiError.details); break;
      case 'SERVER_ERROR': callbacks.onServerError?.(); break;
      case 'NETWORK_ERROR': callbacks.onNetworkError?.(); break;
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
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(handleApiError(error))
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      
      if (!originalRequest || (originalRequest as RetryConfig).__isRetry) {
        return Promise.reject(handleApiError(error));
      }

      if (error.response?.status === 401 && !originalRequest.url?.includes('auth/refresh')) {
        try {
          const refresh_token = TokenService.getRefreshToken();
          if (refresh_token) {
            const response = await instance.post('/auth/refresh/', {
              refresh: refresh_token
            });
            const { access } = response.data;
            
            TokenService.setTokens({ access, refresh: refresh_token });
            originalRequest.headers.authorization = `Bearer ${access}`;
            
            return instance(originalRequest);
          }
        } catch (refreshError) {
          TokenService.clearAll();
          window.location.href = '/login';
          return Promise.reject(handleApiError(refreshError));
        }
      }

      return Promise.reject(handleApiError(error));
    }
  );
};

// Export everything as named exports
export {
  errorUtils as errors,
  retryUtils as retry
};

// Export default for backwards compatibility
export default {
  errors: errorUtils,
  retry: retryUtils,
  handleApiError,
  handleApiErrorWithCallback,
  setupInterceptors,
  DEFAULT_CONFIG,
  DEFAULT_RETRY_OPTIONS
};