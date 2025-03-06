// src/services/apiMainService/utils/logger.ts
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * Configurações de log
 */
interface LogConfig {
  enabled: boolean;
  includeHeaders: boolean;
  includeBody: boolean;
  maxBodyLength: number;
  hideAuthToken: boolean;
  hideBody: string[];
}

// Configuração padrão do logger
const logConfig: LogConfig = {
  enabled: process.env.NODE_ENV !== 'production',
  includeHeaders: true,
  includeBody: true,
  maxBodyLength: 1000,
  hideAuthToken: true,
  hideBody: ['password', 'senha', 'secret', 'token']
};

/**
 * Sanitiza os headers para remover informações sensíveis
 * @param headers Headers da requisição/resposta
 * @returns Headers sanitizados
 */
function sanitizeHeaders(headers: any): any {
  if (!headers) return {};
  
  const sanitized = { ...headers };
  
  if (logConfig.hideAuthToken && sanitized.Authorization) {
    sanitized.Authorization = sanitized.Authorization.replace(/Bearer\s+(.+)/, 'Bearer [REDACTED]');
  }
  
  return sanitized;
}

/**
 * Sanitiza o corpo da requisição/resposta para remover informações sensíveis
 * @param body Corpo da requisição/resposta
 * @returns Corpo sanitizado
 */
function sanitizeBody(body: any): any {
  if (!body) return body;
  
  // Se for string, corta se for muito grande
  if (typeof body === 'string') {
    if (body.length > logConfig.maxBodyLength) {
      return `${body.substring(0, logConfig.maxBodyLength)}... [TRUNCATED]`;
    }
    return body;
  }
  
  // Se for objeto, sanitiza campos sensíveis
  if (typeof body === 'object') {
    const sanitized = { ...body };
    
    logConfig.hideBody.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    // Limita tamanho da representação
    const json = JSON.stringify(sanitized);
    if (json.length > logConfig.maxBodyLength) {
      return JSON.parse(`${json.substring(0, logConfig.maxBodyLength)}... [TRUNCATED]"`);
    }
    
    return sanitized;
  }
  
  return body;
}

/**
 * Registra uma requisição
 * @param config Configuração da requisição
 */
function logRequest(config: AxiosRequestConfig): void {
  if (!logConfig.enabled) return;
  
  const { url, method, params, data, headers } = config;
  
  // Cria objeto de log
  const logData: any = {
    type: '🚀 Request',
    url,
    method: method?.toUpperCase(),
    time: new Date().toISOString()
  };
  
  // Adiciona parâmetros se existirem
  if (params) {
    logData.params = params;
  }
  
  // Adiciona corpo se existir e estiver habilitado
  if (data && logConfig.includeBody) {
    logData.body = sanitizeBody(data);
  }
  
  // Adiciona headers se habilitado
  if (headers && logConfig.includeHeaders) {
    logData.headers = sanitizeHeaders(headers);
  }
  
  console.log(
    `%c${logData.type} [${logData.method}] ${logData.url}`,
    'color: #2563EB; font-weight: bold;',
    logData
  );
}

/**
 * Registra uma resposta
 * @param response Resposta da requisição
 */
function logResponse(response: AxiosResponse): void {
  if (!logConfig.enabled) return;
  
  const { config, status, statusText, data, headers } = response;
  
  // Cria objeto de log
  const logData: any = {
    type: '✅ Response',
    url: config.url,
    method: config.method?.toUpperCase(),
    status,
    statusText,
    time: new Date().toISOString(),
    duration: response.headers['x-response-time'] || 'N/A'
  };
  
  // Adiciona corpo se existir e estiver habilitado
  if (data && logConfig.includeBody) {
    logData.body = sanitizeBody(data);
  }
  
  // Adiciona headers se habilitado
  if (headers && logConfig.includeHeaders) {
    logData.headers = sanitizeHeaders(headers);
  }
  
  console.log(
    `%c${logData.type} [${logData.status}] ${logData.url}`,
    'color: #10B981; font-weight: bold;',
    logData
  );
}

/**
 * Registra um erro
 * @param error Erro da requisição
 */
function logError(error: AxiosError | any): void {
  if (!logConfig.enabled) return;
  
  // Cria objeto de log
  const logData: any = {
    type: '❌ Error',
    time: new Date().toISOString()
  };
  
  // Adiciona informações da requisição se disponível
  if (error.config) {
    logData.url = error.config.url;
    logData.method = error.config.method?.toUpperCase();
    
    // Adiciona corpo da requisição se existir e estiver habilitado
    if (error.config.data && logConfig.includeBody) {
      logData.requestBody = sanitizeBody(error.config.data);
    }
    
    // Adiciona headers da requisição se habilitado
    if (error.config.headers && logConfig.includeHeaders) {
      logData.requestHeaders = sanitizeHeaders(error.config.headers);
    }
  }
  
  // Adiciona informações da resposta se disponível
  if (error.response) {
    logData.status = error.response.status;
    logData.statusText = error.response.statusText;
    
    // Adiciona corpo da resposta se existir e estiver habilitado
    if (error.response.data && logConfig.includeBody) {
      logData.responseBody = sanitizeBody(error.response.data);
    }
    
    // Adiciona headers da resposta se habilitado
    if (error.response.headers && logConfig.includeHeaders) {
      logData.responseHeaders = sanitizeHeaders(error.response.headers);
    }
  } else if (error.request) {
    // Se não há resposta mas há requisição, foi um erro de rede
    logData.errorType = 'Network Error';
  }
  
  // Adiciona mensagem de erro
  logData.message = error.message || 'Unknown error';
  
  // Adiciona stack trace em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    logData.stack = error.stack;
  }
  
  console.error(
    `%c${logData.type} ${logData.status ? `[${logData.status}]` : ''} ${logData.url || ''}`,
    'color: #EF4444; font-weight: bold;',
    logData
  );
}

/**
 * Configura o logger
 * @param config Configurações de log
 */
function configureLogger(config: Partial<LogConfig>): void {
  Object.assign(logConfig, config);
}

export {
  logRequest,
  logResponse,
  logError,
  configureLogger
};