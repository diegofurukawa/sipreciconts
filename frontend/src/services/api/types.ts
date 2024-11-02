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
  
  /** Headers padrão para todas as requisições */
  headers?: Record<string, string>;
}

/**
 * Configuração para retry de requisições
 */
export interface RetryConfig extends ApiConfig {
  __retryCount?: number;
  __isRetry?: boolean;
}

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T = any> {
  /** Dados retornados pela API */
  data: T;
  
  /** Status HTTP da resposta */
  status: number;
  
  /** Mensagem opcional de sucesso */
  message?: string;
}

/**
 * Resposta paginada da API
 */
export interface PaginatedResponse<T> {
  /** Lista de resultados */
  results: T[];
  
  /** Total de registros */
  count: number;
  
  /** URL para próxima página */
  next: string | null;
  
  /** URL para página anterior */
  previous: string | null;
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
  /** Código do erro */
  code: ApiErrorCode;
  
  /** Mensagem de erro */
  message: string;
  
  /** Detalhes adicionais do erro */
  details?: Record<string, unknown>;
}

/**
 * Classe de erro customizada da API
 */
export class ApiError extends Error {
  /** Código do erro */
  code: ApiErrorCode;
  
  /** Detalhes adicionais do erro */
  details?: Record<string, unknown>;

  constructor({ 
    message, 
    code,
    details 
  }: {
    message: string;
    code: ApiErrorCode;
    details?: Record<string, unknown>;
  }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Callbacks para tratamento de erros
 */
export interface ErrorCallbacks {
  /** Callback para erro de não autorizado */
  onUnauthorized?: () => void;
  
  /** Callback para erro de acesso proibido */
  onForbidden?: () => void;
  
  /** Callback para erro de recurso não encontrado */
  onNotFound?: () => void;
  
  /** Callback para erro de validação */
  onValidationError?: (details?: Record<string, unknown>) => void;
  
  /** Callback para erro do servidor */
  onServerError?: () => void;
  
  /** Callback para erro de rede */
  onNetworkError?: () => void;
  
  /** Callback padrão para outros erros */
  onDefault?: (error: ApiError) => void;
}

/**
 * Tipos relacionados à autenticação
 */
export namespace Auth {
  export interface Credentials {
    username: string;
    password: string;
  }

  export interface TokenData {
    access: string;
    refresh: string;
  }

  export interface UserData {
    id: number;
    login: string;
    user_name: string;
    type: string;
    company_id: number;
    email?: string;
  }

  export interface LoginResponse {
    access: string;
    refresh: string;
    user: UserData;
  }

  export interface AuthStatus {
    isAuthenticated: boolean;
    token?: string;
    expiration?: Date;
  }
}

// src/services/api/types.ts
// ... (mantenha as interfaces existentes)

/**
 * Configuração de retry
 */
export interface RetryOptions {
  /** Número máximo de tentativas */
  maxAttempts: number;
  /** Delay base entre tentativas (ms) */
  baseDelay: number;
  /** Códigos HTTP que devem ser retentados */
  statusCodes: number[];
}

/**
 * Tokens de autenticação
 */
export interface AuthTokens {
  access: string;
  refresh: string;
}

/**
 * Estado de retry de uma requisição
 */
export interface RetryState {
  attempt: number;
  delay: number;
  error: any;
}
