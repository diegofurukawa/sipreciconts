// src/services/api/types.ts

/**
 * Configuração base para serviços de API
 */
// export interface ApiConfig {
//   /** URL base para todas as requisições da API */
//   baseURL: string;
//   /** Tempo limite para requisições em milissegundos */
//   timeout?: number;
//   /** Número de tentativas de retry em caso de falha */
//   retryAttempts?: number;
//   /** Delay entre tentativas de retry em milissegundos */
//   retryDelay?: number;
//   /** Headers padrão para todas as requisições */
//   headers?: Record<string, string>;
// }

/**
 * Configuração para retry de requisições
 */
export interface RetryConfig {
  __retryCount?: number;
  __isRetry?: boolean;
  headers?: Record<string, string>;
  url?: string;
}

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
 * Estado de retry de uma requisição
 */
export interface RetryState {
  attempt: number;
  delay: number;
  error: any;
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
  | 'NETWORK_ERROR'
  | 'TOKEN_EXPIRED';

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
  /** Status HTTP do erro */
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
  /** Callback para token expirado */
  onTokenExpired?: () => void;
  /** Callback padrão para outros erros */
  onDefault?: (error: ApiError) => void;
}

/**
 * Namespace para tipos relacionados à autenticação
 */
export namespace Auth {
  export interface Credentials {
    login: string;
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
    name: string;
    type: string;
    company_id: number;
    company_name?: string;
    email?: string;
    role?: string;
    last_login?: string;
    enabled: boolean;
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
    user?: UserData;
  }

  export interface TokenValidationResponse {
    valid: boolean;
    expired?: boolean;
    message?: string;
  }

  export interface TokenRefreshResponse {
    access: string;
  }
}

/**
 * Interface para headers de requisição customizados
 */
export interface CustomRequestHeaders {
  [key: string]: string | undefined;
  Authorization?: string;
  'Content-Type'?: string;
  Accept?: string;
  'X-Company-ID'?: string;
}

/**
 * Interface para opções de requisição
 */
export interface RequestOptions {
  headers?: CustomRequestHeaders;
  params?: Record<string, any>;
  timeout?: number;
  retry?: boolean | RetryOptions;
  signal?: AbortSignal;
}

/**
 * Interface para tokens de autenticação
 */
export interface AuthTokens {
  access: string;
  refresh: string;
  expiresIn?: number;
}