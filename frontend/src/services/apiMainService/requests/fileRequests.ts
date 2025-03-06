// src/services/apiMainService/requests/fileRequests.ts
import { AxiosInstance } from 'axios';
import { baseRequests } from './baseRequests';
import { errorHandler } from '../utils';
import { headerManager } from '../headers';
import type { RequestOptions } from '../config/apiConfig';

/**
 * Métodos para lidar com upload e download de arquivos
 */

/**
 * Realiza upload de um arquivo
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param file Arquivo a ser enviado
 * @param onProgress Callback para progresso do upload
 * @param options Opções adicionais
 * @returns Resposta da API
 */
async function uploadFile(
  api: AxiosInstance,
  url: string,
  file: File,
  onProgress?: (percentage: number) => void,
  options?: RequestOptions & {
    fieldName?: string;
    additionalData?: Record<string, any>;
  }
): Promise<any> {
  try {
    // Cria um FormData
    const formData = new FormData();
    
    // Adiciona o arquivo com o nome do campo (padrão: 'file')
    const fieldName = options?.fieldName || 'file';
    formData.append(fieldName, file);
    
    // Adiciona dados adicionais, se houver
    if (options?.additionalData) {
      Object.entries(options.additionalData).forEach(([key, value]) => {
        // Converte objetos para JSON se necessário
        if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
    }
    
    // Configura o callback de progresso
    const uploadOptions: RequestOptions = {
      ...options,
      headers: {
        ...options?.headers,
        // Não define Content-Type para que o navegador defina corretamente com boundary
      }
    };
    
    const response = await api.post(url, formData, {
      ...uploadOptions,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      }
    });
    
    return response.data;
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

/**
 * Realiza download de um arquivo
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param filename Nome do arquivo (não utilizado na requisição, apenas para referência)
 * @param format Formato do arquivo (csv ou xlsx)
 * @param options Opções adicionais
 * @returns Blob do arquivo
 */
async function downloadFile(
  api: AxiosInstance,
  url: string,
  filename: string,
  format?: 'csv' | 'xlsx',
  options?: RequestOptions & {
    params?: Record<string, any>;
    responseType?: 'blob' | 'arraybuffer';
  }
): Promise<Blob> {
  try {
    // Obtém headers específicos para download de arquivos
    const fileHeaders = headerManager.getFileHeaders(format);
    
    const response = await api.get(url, {
      ...options,
      headers: {
        ...fileHeaders,
        ...options?.headers
      },
      responseType: options?.responseType || 'blob',
      params: options?.params
    });
    
    return new Blob([response.data], {
      type: response.headers['content-type']
    });
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

/**
 * Realiza download de um arquivo e o salva
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param filename Nome do arquivo para salvar
 * @param format Formato do arquivo (csv ou xlsx)
 * @param options Opções adicionais
 */
async function downloadAndSaveFile(
  api: AxiosInstance,
  url: string,
  filename: string,
  format?: 'csv' | 'xlsx',
  options?: RequestOptions
): Promise<void> {
  try {
    const blob = await downloadFile(api, url, filename, format, options);
    
    // Cria URL para o blob
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // Cria link para download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    
    // Adiciona ao DOM, clica e remove
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Libera a URL
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

/**
 * Realiza upload de múltiplos arquivos
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param files Arquivos a serem enviados
 * @param onProgress Callback para progresso do upload
 * @param options Opções adicionais
 * @returns Resposta da API
 */
async function uploadMultipleFiles(
  api: AxiosInstance,
  url: string,
  files: File[],
  onProgress?: (percentage: number) => void,
  options?: RequestOptions & {
    fieldName?: string;
    additionalData?: Record<string, any>;
  }
): Promise<any> {
  try {
    // Cria um FormData
    const formData = new FormData();
    
    // Adiciona os arquivos
    const fieldName = options?.fieldName || 'files';
    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file);
    });
    
    // Adiciona dados adicionais, se houver
    if (options?.additionalData) {
      Object.entries(options.additionalData).forEach(([key, value]) => {
        // Converte objetos para JSON se necessário
        if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
    }
    
    // Configura o callback de progresso
    const uploadOptions: RequestOptions = {
      ...options,
      headers: {
        ...options?.headers,
        // Não define Content-Type para que o navegador defina corretamente com boundary
      }
    };
    
    const response = await api.post(url, formData, {
      ...uploadOptions,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      }
    });
    
    return response.data;
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

export const fileRequests = {
  uploadFile,
  downloadFile,
  downloadAndSaveFile,
  uploadMultipleFiles
};

export default fileRequests;