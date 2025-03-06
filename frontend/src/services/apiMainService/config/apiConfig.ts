// src/services/apiMainService/config/apiConfig.ts

/**
 * Configuração base para o serviço de API
 */
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retry?: RetryConfig;
}

/**
 * Configuração para retry de requisições
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  statusCodes: number[];
}

/**
 * Opções para requisições
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Resposta paginada da API
 */
export interface PaginatedResponse<T = any> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
  current_page?: number;
  total_pages?: number;
}

/**
 * Constantes para códigos de erro
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500
} as const;

/**
 * Mensagens de erro padrão
 */
const ERROR_MESSAGES = {
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  SERVER: 'Erro no servidor. Tente novamente mais tarde.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Acesso negado.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION: 'Dados inválidos.',
  UNKNOWN: 'Ocorreu um erro inesperado.'
} as const;

/**
 * Configuração padrão da API
 */
const DEFAULT_API_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
    statusCodes: [408, 429, 500, 502, 503, 504]
  }
};

/**
 * Obtém a configuração da API mesclando os padrões com configurações customizadas
 */
function getApiConfig(customConfig?: Partial<ApiConfig>): ApiConfig {
  if (!customConfig) {
    return DEFAULT_API_CONFIG;
  }

  return {
    ...DEFAULT_API_CONFIG,
    ...customConfig,
    headers: {
      ...DEFAULT_API_CONFIG.headers,
      ...customConfig.headers
    },
    retry: customConfig.retry ? {
      ...DEFAULT_API_CONFIG.retry,
      ...customConfig.retry
    } : DEFAULT_API_CONFIG.retry
  };
}

/**
 * Exportações
 */
export {
  getApiConfig,
  DEFAULT_API_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES
};

export default {
  getApiConfig,
  DEFAULT_API_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES
};