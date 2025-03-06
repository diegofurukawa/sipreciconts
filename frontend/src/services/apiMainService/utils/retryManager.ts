// src/services/apiMainService/utils/retryManager.ts
import { AxiosInstance, AxiosError } from 'axios';
import { RetryConfig } from '../config/apiConfig';

// Configuração padrão para retry
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  statusCodes: [408, 429, 500, 502, 503, 504]
};

// Propriedade a ser adicionada à config para controlar retentativas
interface RetryableConfig {
  _retryCount?: number;
  _isRetrying?: boolean;
  [key: string]: any;
}

/**
 * Calcula o atraso para retry com base na tentativa atual
 * @param attempt Número da tentativa atual (começando em 1)
 * @param options Configurações de retry
 * @returns Tempo de atraso em milissegundos
 */
function calculateDelay(attempt: number, options: RetryConfig = DEFAULT_RETRY_CONFIG): number {
  // Exponential backoff com jitter
  const baseDelay = options.baseDelay || DEFAULT_RETRY_CONFIG.baseDelay;
  const jitter = Math.random() * 100;
  
  // Limita o atraso máximo a 30 segundos
  return Math.min(
    baseDelay * Math.pow(2, attempt - 1) + jitter,
    30000 // max delay of 30 seconds
  );
}

/**
 * Verifica se uma requisição deve ser retentada
 * @param error Erro da requisição
 * @param options Configurações de retry
 * @returns true se a requisição deve ser retentada
 */
function shouldRetry(
  error: AxiosError | any,
  options: RetryConfig = DEFAULT_RETRY_CONFIG
): boolean {
  // Se não for AxiosError ou não tiver config, não retenta
  if (!error.config) {
    return false;
  }

  const config = error.config as RetryableConfig;
  const currentAttempt = config._retryCount || 0;
  
  // Verifica se já atingiu o número máximo de tentativas
  if (currentAttempt >= (options.maxAttempts || DEFAULT_RETRY_CONFIG.maxAttempts)) {
    return false;
  }

  // Verifica se é um erro de rede (sem resposta)
  if (!error.response) {
    return true;
  }

  // Verifica se o status code está na lista de códigos para retry
  const statusCodes = options.statusCodes || DEFAULT_RETRY_CONFIG.statusCodes;
  return statusCodes.includes(error.response.status);
}

/**
 * Tenta executar uma requisição novamente após falha
 * @param api Instância do Axios
 * @param config Configuração da requisição
 * @param options Configurações de retry
 * @returns Promessa com o resultado da requisição
 */
async function retryRequest(
  api: AxiosInstance,
  config: any,
  options: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<any> {
  const retryConfig = config as RetryableConfig;
  
  // Inicializa contador de retentativas se não existir
  if (retryConfig._retryCount === undefined) {
    retryConfig._retryCount = 0;
  }
  
  // Incrementa contador de retentativas
  retryConfig._retryCount++;
  
  // Marca que está em processo de retry
  retryConfig._isRetrying = true;
  
  // Calcula atraso com base na tentativa atual
  const delay = calculateDelay(retryConfig._retryCount, options);
  
  // Espera o tempo de delay
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Executa a requisição novamente
  return api(retryConfig);
}

/**
 * Configura a funcionalidade de retry para uma instância do Axios
 * @param api Instância do Axios
 * @param options Configurações de retry
 */
function setupRetry(
  api: AxiosInstance,
  options: RetryConfig = DEFAULT_RETRY_CONFIG
): void {
  api.interceptors.response.use(
    response => response,
    async error => {
      if (!shouldRetry(error, options)) {
        return Promise.reject(error);
      }
      
      try {
        return await retryRequest(api, error.config, options);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
  );
}

export const retryManager = {
  calculateDelay,
  shouldRetry,
  retryRequest,
  setupRetry,
  DEFAULT_RETRY_CONFIG
};

export default retryManager;