// src/services/api.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Customer, CustomerResponse, ImportResponse } from '../types/customer';
import { Tax } from '../types/tax';

// Types and Interfaces
interface ApiConfig {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

interface ApiErrorResponse {
  detail?: string;
  message?: string;
  code?: string;
  [key: string]: any;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    login: string;
    company: string;
    company_id?: string;
    [key: string]: any;
  };
}

// Custom Error Class
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Helper Functions
const getErrorMessage = (data: any): string => {
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
};

class ApiService {
  private api: AxiosInstance;
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

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('@App:token');
        if (token) {
          config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        }

        try {
          const companyId = this.getCompanyId();
          if (companyId && !config.url?.includes('auth')) {
            const separator = config.url?.includes('?') ? '&' : '?';
            config.url = `${config.url}${separator}company=${companyId}`;
          }
        } catch (error) {
          if (error instanceof APIError) {
            throw error;
          }
          throw new APIError('Erro ao identificar empresa', 400, 'COMPANY_ID_ERROR');
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

  private getCompanyId(): string {
    const companyId = localStorage.getItem('@App:company_id');
    if (!companyId) {
      throw new APIError('Empresa não selecionada', 400, 'COMPANY_ID_MISSING');
    }
    return companyId;
  }

  private async handleAuthError() {
    try {
      localStorage.removeItem('@App:token');
      localStorage.removeItem('@App:user');
      localStorage.removeItem('@App:company_id');
    } finally {
      window.location.href = '/login';
    }
  }

  private handleError(error: AxiosError): APIError {
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
    const message = getErrorMessage(responseData);
    const errorCode = responseData?.code || `HTTP_${status}`;

    return new APIError(
      message,
      status,
      errorCode,
      responseData
    );
  }

  private checkAuth() {
    if (!localStorage.getItem('@App:token')) {
      throw new APIError('Usuário não autenticado', 401, 'AUTH_REQUIRED');
    }
  }

  public readonly customers = {
    list: async (page: number = 1, filters?: Record<string, any>): Promise<CustomerResponse> => {
      this.checkAuth();
      try {
        const response = await this.api.get<CustomerResponse>('customers/', {
          params: {
            page,
            ...filters,
            company: this.getCompanyId()
          }
        });
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    create: async (data: Partial<Customer>): Promise<Customer> => {
      this.checkAuth();
      try {
        const response = await this.api.post<Customer>('customers/', {
          ...data,
          company: this.getCompanyId()
        });
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
      this.checkAuth();
      try {
        const response = await this.api.put<Customer>(`customers/${id}/`, {
          ...data,
          company: this.getCompanyId()
        });
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    delete: async (id: number): Promise<void> => {
      this.checkAuth();
      try {
        await this.api.delete(`customers/${id}/`, {
          params: { company: this.getCompanyId() }
        });
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    import: async (file: File): Promise<ImportResponse> => {
      this.checkAuth();
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('company', this.getCompanyId());
        
        const response = await this.api.post<ImportResponse>(
          'customers/import_customers/',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    export: async (filters?: Record<string, any>): Promise<void> => {
      this.checkAuth();
      try {
        const response = await this.api.get('customers/export/', {
          params: {
            ...filters,
            company: this.getCompanyId()
          },
          responseType: 'blob',
        });

        if (response.headers['content-type']?.includes('application/json')) {
          const text = await new Blob([response.data]).text();
          const error = JSON.parse(text);
          throw new APIError(
            error.detail || 'Erro ao exportar clientes',
            400,
            'EXPORT_ERROR'
          );
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        const filename = response.headers['content-disposition']
          ?.split('filename=')[1]
          ?.replace(/"/g, '') 
          || `clientes_${new Date().toISOString().split('T')[0]}.csv`;
        
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },
  };

  public readonly taxes = {
    list: async (page: number = 1, filters?: Record<string, any>): Promise<{ results: Tax[]; count: number }> => {
      this.checkAuth();
      try {
        const response = await this.api.get<{ results: Tax[]; count: number }>('taxes/', {
          params: {
            page,
            page_size: 10,
            ...filters,
            company: this.getCompanyId()
          }
        });
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    create: async (data: Partial<Tax>): Promise<Tax> => {
      this.checkAuth();
      try {
        const response = await this.api.post<Tax>('taxes/', {
          ...data,
          company: this.getCompanyId()
        });
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    update: async (id: number, data: Partial<Tax>): Promise<Tax> => {
      this.checkAuth();
      try {
        const response = await this.api.put<Tax>(`taxes/${id}/`, {
          ...data,
          company: this.getCompanyId()
        });
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    delete: async (id: number): Promise<void> => {
      this.checkAuth();
      try {
        await this.api.delete(`taxes/${id}/`, {
          params: { company: this.getCompanyId() }
        });
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    }
  };

  public readonly auth = {
    login: async (login: string, password: string): Promise<AuthResponse> => {
      try {
        const response = await this.api.post<AuthResponse>('/auth/login/', { login, password });
        const { token, user } = response.data;
        
        localStorage.setItem('@App:token', `Bearer ${token}`);
        localStorage.setItem('@App:user', JSON.stringify(user));
        localStorage.setItem('@App:company_id', user.company || user.company_id || '');
        
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    logout: async (): Promise<void> => {
      try {
        const token = localStorage.getItem('@App:token');
        if (token) {
          await this.api.post('/auth/logout/');
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        localStorage.removeItem('@App:token');
        localStorage.removeItem('@App:user');
        localStorage.removeItem('@App:company_id');
        window.location.href = '/login';
      }
    },

    isAuthenticated: (): boolean => {
      const token = localStorage.getItem('@App:token');
      const user = localStorage.getItem('@App:user');
      return !!(token && user);
    }
  };
}

export const apiService = new ApiService({
  baseURL: 'http://localhost:8000/api/',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
});

export default apiService;