// src/services/api/ApiService.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenService } from './token';
import { errorUtils, retryUtils } from './utils';
import { API_CONFIG } from './constants';
import type { 
  ApiError, 
  ApiConfig, 
  CustomRequestHeaders, 
  PaginatedResponse,
  ApiResponse 
} from './types';

export class ApiService {
  protected api: AxiosInstance;
  protected companyId: number | null = null;

  constructor(config: Partial<ApiConfig> = {}) {
    // Merge default config with provided config
    const mergedConfig = { 
      ...API_CONFIG,
      ...config
    };
    
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
      (error) => Promise.reject(error)
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
              const response = await this.api.post('/auth/refresh/', {
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

        return Promise.reject(error);
      }
    );

    // Setup retry
    retryUtils.setupRetry(this.api);
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

  // Protected request methods
  protected async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.request<T>(config);
      return response.data;
    } catch (error) {
      throw errorUtils.handleApiError(error);
    }
  }

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

  // Utility methods for paginated requests
  protected async getPaginated<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: Partial<AxiosRequestConfig>
  ): Promise<PaginatedResponse<T>> {
    return this.get<PaginatedResponse<T>>(url, params, config);
  }

  // File upload
  protected async uploadFile(
    url: string,
    file: File,
    onProgress?: (percentage: number) => void,
    config?: Partial<AxiosRequestConfig>
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.post<ApiResponse>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      },
    });
  }

  // File download
  protected async downloadFile(
    url: string,
    filename: string,
    config?: Partial<AxiosRequestConfig>
  ): Promise<void> {
    const response = await this.api.get(url, {
      ...config,
      responseType: 'blob'
    });

    const blob = new Blob([response.data]);
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

// Create default instance
export const apiService = new ApiService();

// Export factory function
export const createApiService = (config?: Partial<ApiConfig>) => {
  return new ApiService(config);
};

export default ApiService;