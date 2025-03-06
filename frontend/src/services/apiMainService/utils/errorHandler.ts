// src/services/apiMainService/utils/errorHandler.ts
import axios, { AxiosError } from 'axios';
import { ERROR_MESSAGES } from '../config/apiConfig';

/**
 * Tipos de erro da API
 */
export type ApiErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TOKEN_EXPIRED';

/**
 * Classe de erro customizada para a API
 */
export class ApiError extends Error {
  code: ApiErrorCode;
  details?: Record<string, unknown>;
  status?: number;

  constructor({ 
    message, 
    code,
    details,
    status 
  }: {
    message: string;
    code: ApiErrorCode;
    details?: Record<string, unknown>;
    status?: number;
  }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

/**
 * Determina o código de erro com base no status HTTP
 * @param status Código de status HTTP
 * @returns Código de erro da API
 */
function getErrorCode(status?: number): ApiErrorCode {
  switch (status) {
    case 401: return 'UNAUTHORIZED';
    case 403: return 'FORBIDDEN';
    case 404: return 'NOT_FOUND';
    case 422: return 'VALIDATION_ERROR';
    case undefined: return 'NETWORK_ERROR';
    default: return 'SERVER_ERROR';
  }
}

/**
 * Determina a mensagem de erro com base no código de erro
 * @param code Código de erro da API
 * @param defaultMessage Mensagem padrão se não houver correspondência
 * @returns Mensagem de erro
 */
function getErrorMessage(code: ApiErrorCode, defaultMessage?: string): string {
  switch (code) {
    case 'UNAUTHORIZED': return ERROR_MESSAGES.UNAUTHORIZED;
    case 'FORBIDDEN': return ERROR_MESSAGES.FORBIDDEN;
    case 'NOT_FOUND': return ERROR_MESSAGES.NOT_FOUND;
    case 'VALIDATION_ERROR': return ERROR_MESSAGES.VALIDATION;
    case 'SERVER_ERROR': return ERROR_MESSAGES.SERVER;
    case 'NETWORK_ERROR': return ERROR_MESSAGES.NETWORK;
    case 'TOKEN_EXPIRED': return ERROR_MESSAGES.UNAUTHORIZED;
    default: return defaultMessage || ERROR_MESSAGES.UNKNOWN;
  }
}

/**
 * Verifica se é um erro de autenticação
 * @param error Erro a ser verificado
 * @returns true se for um erro de autenticação
 */
function isAuthError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN';
  }
  
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return status === 401 || status === 403;
  }
  
  return false;
}

/**
 * Verifica se é um erro de rede
 * @param error Erro a ser verificado
 * @returns true se for um erro de rede
 */
function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.code === 'NETWORK_ERROR';
  }
  
  if (axios.isAxiosError(error)) {
    return !error.response || error.code === 'ECONNABORTED';
  }
  
  return false;
}

/**
 * Formata uma mensagem de erro para exibição
 * @param error Erro a ser formatado
 * @returns Mensagem de erro formatada
 */
function formatErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.details) {
      const details = Object.entries(error.details)
        .map(([field, messages]) => {
          const formattedMessages = Array.isArray(messages) 
            ? messages.join(', ') 
            : String(messages);
          return `${field}: ${formattedMessages}`;
        })
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
}

/**
 * Trata um erro da API e converte para ApiError
 * @param error Erro a ser tratado
 * @returns Erro tratado como ApiError
 */
function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const code = getErrorCode(axiosError.response?.status);
    const message = axiosError.response?.data?.message || 
                  axiosError.response?.data?.detail ||
                  getErrorMessage(code);

    return new ApiError({
      message,
      code,
      details: axiosError.response?.data?.details || axiosError.response?.data?.errors,
      status: axiosError.response?.status
    });
  }

  // Para outros tipos de erro
  return new ApiError({
    message: error instanceof Error ? error.message : 'Um erro inesperado ocorreu',
    code: 'SERVER_ERROR'
  });
}

/**
 * Interface para callbacks de tratamento de erro
 */
export interface ErrorCallbacks {
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  onNotFound?: () => void;
  onValidationError?: (details?: Record<string, unknown>) => void;
  onServerError?: () => void;
  onNetworkError?: () => void;
  onTokenExpired?: () => void;
  onDefault?: (error: ApiError) => void;
}

/**
 * Trata um erro da API e executa callbacks apropriados
 * @param error Erro a ser tratado
 * @param callbacks Callbacks a serem executados com base no tipo de erro
 * @returns Erro tratado como ApiError
 */
function handleApiErrorWithCallbacks(
  error: unknown,
  callbacks?: ErrorCallbacks
): ApiError {
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
      case 'TOKEN_EXPIRED': 
        callbacks.onTokenExpired?.(); 
        break;
      default: 
        callbacks.onDefault?.(apiError);
    }
  }
  
  return apiError;
}

export const errorHandler = {
  ApiError,
  getErrorCode,
  getErrorMessage,
  isAuthError,
  isNetworkError,
  formatErrorMessage,
  handleApiError,
  handleApiErrorWithCallbacks
};

export default errorHandler;