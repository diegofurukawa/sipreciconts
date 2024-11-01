// src/services/api/types.ts

/**
 * Configuração base para serviços de API
 */
export interface ApiConfig {
  /** URL base para todas as requisições da API */
  baseURL: string;
  
  /** Tempo limite para requisições em milissegundos */
  timeout?: number;
  
  /** Número de tentativas de retry em caso de falha */
  retryAttempts?: number;
  
  /** Delay entre tentativas de retry em milissegundos */
  retryDelay?: number;
}

/**
 * Resposta padrão da API com paginação
 */
export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

/**
 * Erro padrão da API
 */
export class ApiError extends Error {
  code?: string;
  details?: Record<string, unknown>;

  constructor({ 
    message, 
    code,
    details 
  }: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}
/**
 * Status da autenticação
 */
export interface AuthStatus {
  isAuthenticated: boolean;
  token?: string;
  expiration?: Date;
}

/**
 * Códigos de erro da API
 */
export type ApiErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR';

/**
 * Resposta de erro da API
 */
export interface ApiErrorResponse {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Callbacks para tratamento de erros
 */
export interface ErrorCallbacks {
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  onNotFound?: () => void;
  onValidationError?: (details?: Record<string, unknown>) => void;
  onServerError?: () => void;
  onNetworkError?: () => void;
  onDefault?: (error: Error) => void;
}