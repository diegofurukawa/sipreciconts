// src/services/api/utils.ts
import axios, { AxiosError } from 'axios';
import { ApiError, ApiConfig, ApiErrorCode, ApiErrorResponse, ErrorCallbacks } from './types';

export const defaultConfig: ApiConfig = {
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};

export const api = axios.create({
  baseURL: defaultConfig.baseURL,
  timeout: defaultConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Verifica se o erro é relacionado à autenticação
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof ApiError) {
    return error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN';
  }
  
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return status === 401 || status === 403;
  }
  
  return false;
};

/**
 * Verifica se o erro é relacionado à rede
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof ApiError) {
    return error.code === 'NETWORK_ERROR';
  }
  
  if (axios.isAxiosError(error)) {
    return !error.response || error.code === 'ECONNABORTED';
  }
  
  return false;
};

/**
 * Formata a mensagem de erro para exibição
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.details) {
      // Se houver detalhes de validação, formata eles
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
};

/**
 * Trata o erro da API com callbacks específicos para cada tipo de erro
 */
export const handleApiErrorWithCallback = (
  error: unknown,
  callbacks?: ErrorCallbacks
): ApiError => {
  const apiError = handleApiError(error);
  
  if (callbacks) {
    switch (apiError.code) {
      case 'UNAUTHORIZED':
        callbacks.onUnauthorized?.();
        break;
      case 'FORBIDDEN':
        callbacks.onForbidden?.();
        break;
      case 'NOT_FOUND':
        callbacks.onNotFound?.();
        break;
      case 'VALIDATION_ERROR':
        callbacks.onValidationError?.(apiError.details);
        break;
      case 'SERVER_ERROR':
        callbacks.onServerError?.();
        break;
      case 'NETWORK_ERROR':
        callbacks.onNetworkError?.();
        break;
      default:
        callbacks.onDefault?.(apiError);
    }
  }
  
  return apiError;
};

/**
 * Trata erros da API e converte para ApiError
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    let code: ApiErrorCode = 'SERVER_ERROR';
    
    switch (axiosError.response?.status) {
      case 401:
        code = 'UNAUTHORIZED';
        break;
      case 403:
        code = 'FORBIDDEN';
        break;
      case 404:
        code = 'NOT_FOUND';
        break;
      case 422:
        code = 'VALIDATION_ERROR';
        break;
      case undefined:
        code = 'NETWORK_ERROR';
        break;
    }

    return new ApiError({
      message: axiosError.response?.data?.message || 
               'Ocorreu um erro ao processar sua requisição',
      code,
      details: axiosError.response?.data?.details
    });
  }

  return new ApiError({
    message: error instanceof Error ? error.message : 'Um erro inesperado ocorreu',
    code: 'SERVER_ERROR'
  });
};