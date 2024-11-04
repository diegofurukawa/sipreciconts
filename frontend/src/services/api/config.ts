// src/services/api/config.ts
interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export const API_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};

export const ERROR_MESSAGES = {
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  SERVER: 'Erro no servidor. Tente novamente mais tarde.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Acesso negado.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION: 'Dados inválidos.',
  UNKNOWN: 'Ocorreu um erro inesperado.'
} as const;