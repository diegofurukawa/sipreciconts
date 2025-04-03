// src/services/api/apiClient.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DEFAULT_API_CONFIG } from '@/services/apiMainService/config';

// Cliente Axios tipado
export const apiClient: AxiosInstance = axios.create({
  baseURL: DEFAULT_API_CONFIG.baseURL,
  timeout: DEFAULT_API_CONFIG.timeout || 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Função auxiliar para obter headers com autenticação
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  
  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Adiciona company_id se disponível
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.company_id) {
        headers['X-Company-ID'] = userData.company_id;
      }
    } catch (e) {
      console.error('Erro ao parsear dados do usuário:', e);
    }
  }

  return headers;
}

// Funções tipadas para requisições básicas
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, {
    ...config,
    headers: {
      ...getAuthHeaders(),
      ...config?.headers
    }
  });
  return response.data;
}

export async function apiPost<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<T>(url, data, {
    ...config,
    headers: {
      ...getAuthHeaders(),
      ...config?.headers
    }
  });
  return response.data;
}

export async function apiPut<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<T>(url, data, {
    ...config,
    headers: {
      ...getAuthHeaders(),
      ...config?.headers
    }
  });
  return response.data;
}

export async function apiPatch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.patch<T>(url, data, {
    ...config,
    headers: {
      ...getAuthHeaders(),
      ...config?.headers
    }
  });
  return response.data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, {
    ...config,
    headers: {
      ...getAuthHeaders(),
      ...config?.headers
    }
  });
  return response.data;
}

// Funções especializadas para casos específicos


/**
 * Função para exportar dados para arquivo
 * @param url URL para exportação
 * @param defaultFilename Nome padrão do arquivo se não especificado pela API
 */
export async function apiExport(
    url: string,
    defaultFilename: string = 'export.xlsx'
  ): Promise<void> {
    try {
      // Usando apenas os headers de autenticação, sem especificar Accept
      const response = await apiClient.get(url, {
        headers: getAuthHeaders(), // Apenas os headers de autenticação
        responseType: 'blob',
      });
      
      // Obter nome do arquivo do cabeçalho Content-Disposition se disponível
      let filename = defaultFilename;
      const contentDisposition = response.headers['content-disposition'];
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Criar URL de download e acionar download
      const downloadUrl = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Limpeza
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
    } catch (error) {
      console.error('Erro na exportação:', error);
      throw error;
    }
  }

/**
 * Interface para opções de importação
 */
export interface ImportOptions {
  onProgress?: (percentage: number) => void;
  additionalParams?: Record<string, any>;
  fieldName?: string;
}

/**
 * Função para importar arquivo
 * @param url URL para importação
 * @param file Arquivo a ser enviado
 * @param options Opções de importação
 */
// Ajuste na função apiImport
export async function apiImport<T>(
  url: string, 
  file: File, 
  options?: ImportOptions
): Promise<T> {
  if (!file) {
    throw new Error('Nenhum arquivo fornecido para importação');
  }

  // Cria um FormData para envio de arquivos
  const formData = new FormData();
  
  // Adiciona o arquivo com o nome exato que o backend espera
  const fieldName = options?.fieldName || 'file';
  formData.append(fieldName, file, file.name);
  
  // Adiciona parâmetros adicionais se fornecidos
  if (options?.additionalParams) {
    Object.entries(options.additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
  }
  
  // Log para debug
  console.log('Enviando arquivo para importação:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    formDataEntries: [...formData.entries()].map(entry => ({
      key: entry[0],
      value: entry[1] instanceof File ? `File: ${entry[1].name}` : entry[1]
    }))
  });
  
  // Realiza a requisição com o formData
  const response = await apiClient.post<T>(url, formData, {
    headers: {
      ...getAuthHeaders(),
      // Importante: Não definir Content-Type aqui - o navegador define automaticamente com boundary
    },
    onUploadProgress: (progressEvent) => {
      if (options?.onProgress && progressEvent.total) {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        options.onProgress(percentage);
      }
    }
  });
  
  return response.data;
}

/**
 * Função para download de templates ou outros arquivos
 * @param url URL para download
 * @param format Formato do arquivo
 * @param config Configurações adicionais
 */
export async function apiDownloadTemplate(
  url: string, 
  format: 'csv' | 'xlsx' = 'csv',
  config?: AxiosRequestConfig
): Promise<Blob> {
  const response = await apiClient.get(url, {
    ...config,
    headers: {
      ...getAuthHeaders(),
      'Accept': format === 'xlsx'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv',
      ...config?.headers
    },
    responseType: 'blob',
  });
  
  return response.data;
}