// src/services/apiMainService/requests/baseRequests.ts
import { AxiosInstance } from 'axios';
import { tokenManager } from '../auth';
import { errorHandler } from '../utils';
import { headerManager } from '../headers';
import type { RequestOptions } from '../config/apiConfig';

/**
 * Métodos básicos para requisições HTTP
 */

/**
 * Realiza uma requisição GET
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param params Parâmetros da query string
 * @param options Opções adicionais
 * @returns Resultado da requisição
 */
async function get<T = any>(
  api: AxiosInstance,
  url: string,
  params?: Record<string, any>,
  options?: RequestOptions
): Promise<T> {
  try {
    // Verifica se o token é válido antes da requisição
    await ensureValidToken();
    
    const response = await api.get<T>(url, {
      params,
      headers: options?.headers,
      timeout: options?.timeout,
      signal: options?.signal
    });
    
    return response.data;
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

/**
 * Realiza uma requisição POST
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param data Dados a serem enviados
 * @param options Opções adicionais
 * @returns Resultado da requisição
 */
async function post<T = any>(
  api: AxiosInstance,
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  try {
    // Verifica se o token é válido antes da requisição
    await ensureValidToken();
    
    const response = await api.post<T>(url, data, {
      headers: options?.headers,
      params: options?.params,
      timeout: options?.timeout,
      signal: options?.signal
    });
    
    return response.data;
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

/**
 * Realiza uma requisição PUT
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param data Dados a serem enviados
 * @param options Opções adicionais
 * @returns Resultado da requisição
 */
async function put<T = any>(
  api: AxiosInstance,
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  try {
    // Verifica se o token é válido antes da requisição
    await ensureValidToken();
    
    const response = await api.put<T>(url, data, {
      headers: options?.headers,
      params: options?.params,
      timeout: options?.timeout,
      signal: options?.signal
    });
    
    return response.data;
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

/**
 * Realiza uma requisição PATCH
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param data Dados a serem enviados
 * @param options Opções adicionais
 * @returns Resultado da requisição
 */
async function patch<T = any>(
  api: AxiosInstance,
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  try {
    // Verifica se o token é válido antes da requisição
    await ensureValidToken();
    
    const response = await api.patch<T>(url, data, {
      headers: options?.headers,
      params: options?.params,
      timeout: options?.timeout,
      signal: options?.signal
    });
    
    return response.data;
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

/**
 * Realiza uma requisição DELETE
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param options Opções adicionais
 * @returns Resultado da requisição
 */
async function del<T = any>(
  api: AxiosInstance,
  url: string,
  options?: RequestOptions
): Promise<T> {
  try {
    // Verifica se o token é válido antes da requisição
    await ensureValidToken();
    
    const response = await api.delete<T>(url, {
      headers: options?.headers,
      params: options?.params,
      timeout: options?.timeout,
      signal: options?.signal
    });
    
    return response.data;
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

/**
 * Realiza uma requisição HEAD
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param options Opções adicionais
 * @returns Resultado da requisição
 */
async function head(
  api: AxiosInstance,
  url: string,
  options?: RequestOptions
): Promise<any> {
  try {
    // Verifica se o token é válido antes da requisição
    await ensureValidToken();
    
    const response = await api.head(url, {
      headers: options?.headers,
      params: options?.params,
      timeout: options?.timeout,
      signal: options?.signal
    });
    
    return response.headers;
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

/**
 * Garante que haja um token válido antes de fazer requisições
 */
async function ensureValidToken(): Promise<boolean> {
  // Verifica se tem token
  const token = tokenManager.getAccessToken();
  if (!token) return false;
  
  // Verifica se o token é válido
  if (tokenManager.isTokenValid(token)) {
    return true;
  }
  
  // Tenta renovar o token
  return await tokenManager.refreshCurrentToken();
}

export const baseRequests = {
  get,
  post,
  put,
  patch,
  delete: del,
  head,
  ensureValidToken
};

export default baseRequests;