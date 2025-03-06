// src/services/apiMainService/ApiService.ts
import axios, { AxiosInstance } from 'axios';
import { configureInterceptors } from '@/services/apiMainService/interceptors';
import { headerManager } from '@/services/apiMainService/headers';
import { baseRequests } from '@/services/apiMainService/requests/baseRequests';
import { paginatedRequests } from '@/services/apiMainService/requests/paginatedRequests';
import { fileRequests } from '@/services/apiMainService/requests/fileRequests';
import { tokenManager } from '@/services/apiMainService/auth';
import { errorHandler } from '@/services/apiMainService/utils';
import { getApiConfig, ApiConfig } from '@/services/apiMainService/config/apiConfig';

/**
 * Serviço principal de API que coordena os módulos de requisição
 */
export class ApiService {
  protected api: AxiosInstance;
  private companyId: string | null = null;

  constructor(config?: Partial<ApiConfig>) {
    // Obter configuração completa mesclando padrões com personalizações
    const apiConfig = getApiConfig(config);
    
    // Criar instância do Axios
    this.api = axios.create(apiConfig);
    
    // Configurar interceptadores
    configureInterceptors(this.api);
  }

  /**
   * Define o ID da empresa para requisições que necessitam desse contexto
   */
  setCompanyId(id: string | null): void {
    this.companyId = id;
    headerManager.updateHeaders(this.api, { companyId: id });
  }

  /**
   * Obtém o ID da empresa atual
   */
  getCompanyId(): string | null {
    return this.companyId;
  }

  /**
   * Métodos HTTP básicos
   */
  async get<T = any>(url: string, params?: Record<string, any>, options?: any): Promise<T> {
    return baseRequests.get<T>(this.api, url, params, options);
  }

  async post<T = any>(url: string, data?: any, options?: any): Promise<T> {
    return baseRequests.post<T>(this.api, url, data, options);
  }

  async put<T = any>(url: string, data?: any, options?: any): Promise<T> {
    return baseRequests.put<T>(this.api, url, data, options);
  }

  async patch<T = any>(url: string, data?: any, options?: any): Promise<T> {
    return baseRequests.patch<T>(this.api, url, data, options);
  }

  async delete<T = any>(url: string, options?: any): Promise<T> {
    return baseRequests.delete<T>(this.api, url, options);
  }

  /**
   * Métodos para requisições paginadas
   */
  async getPaginated<T = any>(url: string, params?: Record<string, any>, options?: any): Promise<T> {
    return paginatedRequests.getPaginated<T>(this.api, url, params, options);
  }

  /**
   * Métodos para manipulação de arquivos
   */
  async uploadFile(url: string, file: File, onProgress?: (percentage: number) => void, options?: any): Promise<any> {
    return fileRequests.uploadFile(this.api, url, file, onProgress, options);
  }

  async downloadFile(url: string, filename: string, format?: 'csv' | 'xlsx', options?: any): Promise<Blob> {
    return fileRequests.downloadFile(this.api, url, filename, format, options);
  }

  async downloadAndSaveFile(url: string, filename: string, format?: 'csv' | 'xlsx', options?: any): Promise<void> {
    return fileRequests.downloadAndSaveFile(this.api, url, filename, format, options);
  }

  /**
   * Métodos para validação e refresh de token
   */
  async refreshToken(): Promise<boolean> {
    return tokenManager.refreshCurrentToken(this.api);
  }

  /**
   * Método para teste de conexão
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.get('/health-check');
      return true;
    } catch (error) {
      errorHandler.handleApiError(error);
      return false;
    }
  }
}