// src/services/api/constants.ts
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
} as const;

export const RETRY_CONFIG = {
  maxAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
  baseDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
  statusCodes: [408, 429, 500, 502, 503, 504]
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  SERVER: 'Erro no servidor. Tente novamente mais tarde.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Acesso negado.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION: 'Dados inválidos.',
  UNKNOWN: 'Ocorreu um erro inesperado.'
} as const;

export const HTTP_STATUS = {
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

// Agrupamento de todas as constantes
export const API_CONSTANTS = {
  CONFIG: API_CONFIG,
  RETRY: RETRY_CONFIG,
  ERROR_MESSAGES,
  HTTP_STATUS
} as const;

// Types
export type ApiConfig = typeof API_CONFIG;
export type RetryConfig = typeof RETRY_CONFIG;
export type ErrorMessages = typeof ERROR_MESSAGES;
export type HttpStatus = typeof HTTP_STATUS;
export type ApiConstants = typeof API_CONSTANTS;