// src/services/apiMainService/headers/headerManager.ts
import { AxiosInstance, AxiosHeaders } from 'axios';

/**
 * Interface para armazenar os headers da aplicação
 */
interface AppHeaders {
  Authorization?: string;
  'Content-Type'?: string;
  'Accept'?: string;
  'X-Company-ID'?: string;
  'X-Session-ID'?: string;
  [key: string]: string | undefined;
}

// Armazena os headers atuais da aplicação
let currentHeaders: AppHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

/**
 * Adiciona ou atualiza headers na instância atual
 * @param headers Os headers a serem adicionados/atualizados
 */
function setHeaders(headers: AppHeaders): void {
  currentHeaders = {
    ...currentHeaders,
    ...headers
  };
}

/**
 * Obtém todos os headers atuais
 * @returns Os headers atuais
 */
function getHeaders(): AppHeaders {
  return { ...currentHeaders };
}

/**
 * Limpa todos os headers de autenticação
 */
function clearAuthHeaders(): void {
  const { Authorization, 'X-Company-ID': companyId, 'X-Session-ID': sessionId, ...rest } = currentHeaders;
  currentHeaders = rest;
}

/**
 * Define o token de autenticação
 * @param token O token de autenticação
 */
function setAuthToken(token: string | null): void {
  if (token) {
    // Verifica se já tem o prefixo Bearer
    currentHeaders.Authorization = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;
  } else {
    delete currentHeaders.Authorization;
  }
}

/**
 * Define o ID da sessão
 * @param sessionId O ID da sessão
 */
function setSessionId(sessionId: string | null): void {
  if (sessionId) {
    currentHeaders['X-Session-ID'] = sessionId;
  } else {
    delete currentHeaders['X-Session-ID'];
  }
}

/**
 * Define o ID da empresa
 * @param companyId O ID da empresa
 */
function setCompanyId(companyId: string | null): void {
  if (companyId) {
    currentHeaders['X-Company-ID'] = companyId;
  } else {
    delete currentHeaders['X-Company-ID'];
  }
}

/**
 * Obtém headers específicos para download de arquivos
 * @param format Formato do arquivo (csv ou xlsx)
 * @returns Headers para download de arquivos
 */
function getFileHeaders(format?: 'csv' | 'xlsx'): AppHeaders {
  return {
    ...getHeaders(),
    'Accept': format === 'xlsx'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv'
  };
}

/**
 * Obtém headers para upload de arquivos
 * @returns Headers para upload de arquivos
 */
function getUploadHeaders(): AppHeaders {
  // Não incluir Content-Type para que o navegador defina automaticamente
  // com boundary para upload de arquivos
  const { 'Content-Type': contentType, ...rest } = getHeaders();
  return rest;
}

/**
 * Atualiza os headers de uma instância do Axios
 * @param api Instância do Axios
 * @param updates Headers a serem atualizados
 */
function updateHeaders(
  api: AxiosInstance, 
  updates: {
    token?: string | null;
    sessionId?: string | null;
    companyId?: string | null;
    contentType?: string | null;
  }
): void {
  // Atualiza headers locais
  if (updates.token !== undefined) {
    setAuthToken(updates.token);
  }
  
  if (updates.sessionId !== undefined) {
    setSessionId(updates.sessionId);
  }
  
  if (updates.companyId !== undefined) {
    setCompanyId(updates.companyId);
  }
  
  if (updates.contentType !== undefined && updates.contentType) {
    currentHeaders['Content-Type'] = updates.contentType;
  }
  
  // Atualiza headers da instância
  if (api.defaults.headers && typeof api.defaults.headers === 'object') {
    const headers = new AxiosHeaders(api.defaults.headers);
    
    Object.entries(currentHeaders).forEach(([key, value]) => {
      if (value) {
        headers.set(key, value);
      } else {
        headers.delete(key);
      }
    });
    
    api.defaults.headers = headers;
  }
}

export const headerManager = {
  setHeaders,
  getHeaders,
  clearAuthHeaders,
  setAuthToken,
  setSessionId,
  setCompanyId,
  getFileHeaders,
  getUploadHeaders,
  updateHeaders
};

export default headerManager;