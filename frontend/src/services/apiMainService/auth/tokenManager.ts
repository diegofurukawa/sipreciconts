// src/services/apiMainService/auth/tokenManager.ts
import { AxiosInstance } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { headerManager } from '../headers';

/**
 * Gerenciador de tokens para autenticação
 */

// Chaves para armazenamento no localStorage
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_REFRESH_IN_PROGRESS = 'token_refresh_in_progress';

/**
 * Interface para payload do token JWT
 */
interface TokenPayload {
  exp: number;
  iat: number;
  user_id: number;
  jti: string;
  [key: string]: any;
}

/**
 * Interface para resposta de refresh de token
 */
interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}

// Controle para não fazer múltiplas requisições de refresh simultâneas
let refreshPromise: Promise<boolean> | null = null;

/**
 * Armazena o token de acesso
 * @param token Token de acesso
 */
function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  headerManager.setAuthToken(token);
}

/**
 * Obtém o token de acesso
 * @returns Token de acesso ou null se não existir
 */
function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Armazena o token de refresh
 * @param token Token de refresh
 */
function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Obtém o token de refresh
 * @returns Token de refresh ou null se não existir
 */
function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Limpa todos os tokens
 */
function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_REFRESH_IN_PROGRESS);
  headerManager.clearAuthHeaders();
}

/**
 * Verifica se um token ainda é válido
 * @param token Token a ser verificado
 * @param bufferSeconds Tempo em segundos antes da expiração para considerar inválido
 * @returns true se o token for válido, false caso contrário
 */
function isTokenValid(token?: string | null, bufferSeconds: number = 60): boolean {
  if (!token) {
    token = getAccessToken();
    if (!token) return false;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Considera o token inválido se faltar menos que bufferSeconds para expirar
    return decoded.exp > (currentTime + bufferSeconds);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return false;
  }
}

/**
 * Obtém a data de expiração do token
 * @param token Token a ser verificado, usa o armazenado se não for fornecido
 * @returns Data de expiração ou null se não for possível determinar
 */
function getTokenExpiration(token?: string): Date | null {
  if (!token) {
    token = getAccessToken();
    if (!token) return null;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

/**
 * Obtém os dados do payload do token
 * @param token Token a ser decodificado, usa o armazenado se não for fornecido
 * @returns Payload do token ou null se não for possível decodificar
 */
function getTokenPayload(token?: string): TokenPayload | null {
  if (!token) {
    token = getAccessToken();
    if (!token) return null;
  }

  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

/**
 * Atualiza o token usando o refresh token
 * @param api Instância do Axios para fazer a requisição
 * @returns true se o token foi atualizado com sucesso, false caso contrário
 */
async function refreshCurrentToken(api?: AxiosInstance): Promise<boolean> {
  // Verificar se já há um refresh em andamento
  if (localStorage.getItem(TOKEN_REFRESH_IN_PROGRESS) === 'true') {
    console.log('Refresh de token já está em andamento, aguardando...');
    
    // Aguarda até que o refresh em andamento termine
    return new Promise((resolve) => {
      const checkRefreshStatus = setInterval(() => {
        if (localStorage.getItem(TOKEN_REFRESH_IN_PROGRESS) !== 'true') {
          clearInterval(checkRefreshStatus);
          
          // Verifica se o token atualizado é válido
          const token = getAccessToken();
          resolve(!!token && isTokenValid(token));
        }
      }, 100); // Verificar a cada 100ms
      
      // Timeout para não ficar em loop infinito
      setTimeout(() => {
        clearInterval(checkRefreshStatus);
        resolve(false);
      }, 5000); // Timeout após 5 segundos
    });
  }
  
  // Se já existe uma Promise de refresh, retorna ela
  if (refreshPromise) {
    return refreshPromise;
  }
  
  // Marca que um refresh está em andamento
  localStorage.setItem(TOKEN_REFRESH_IN_PROGRESS, 'true');
  
  // Cria nova Promise de refresh
  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      localStorage.removeItem(TOKEN_REFRESH_IN_PROGRESS);
      return false;
    }

    try {
      console.log('Iniciando refresh de token...');
      
      // Se uma instância do Axios foi fornecida, usa-a
      // Caso contrário, cria uma requisição fetch diretamente
      if (api) {
        const response = await api.post<TokenRefreshResponse>('/auth/refresh/', {
          refresh: refreshToken
        });

        if (response.data.access) {
          setAccessToken(response.data.access);
          
          if (response.data.refresh) {
            setRefreshToken(response.data.refresh);
          }
          
          console.log('Token atualizado com sucesso');
          localStorage.removeItem(TOKEN_REFRESH_IN_PROGRESS);
          return true;
        }
      } else {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/auth/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refresh: refreshToken })
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.access) {
            setAccessToken(data.access);
            
            if (data.refresh) {
              setRefreshToken(data.refresh);
            }
            
            console.log('Token atualizado com sucesso');
            localStorage.removeItem(TOKEN_REFRESH_IN_PROGRESS);
            return true;
          }
        } else {
          // Se o status for 401 ou 403, significa que o refresh token expirou
          if (response.status === 401 || response.status === 403) {
            console.error('Refresh token expirado ou inválido');
            clearTokens();
            
            // Dispara o evento de sessão expirada
            window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
          }
        }
      }
      
      localStorage.removeItem(TOKEN_REFRESH_IN_PROGRESS);
      return false;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      clearTokens();
      
      // Dispara o evento de sessão expirada
      window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
      
      localStorage.removeItem(TOKEN_REFRESH_IN_PROGRESS);
      return false;
    } finally {
      // Limpa a Promise de refresh
      refreshPromise = null;
    }
  })();
  
  return refreshPromise;
}

/**
 * Verifica se o token precisa ser atualizado e atualiza automaticamente se necessário
 * @returns Promise que resolve para true se o token está válido ou foi atualizado com sucesso
 */
async function ensureValidToken(): Promise<boolean> {
  const token = getAccessToken();
  
  // Se não há token, retorna false
  if (!token) return false;
  
  // Se o token ainda é válido, retorna true
  if (isTokenValid(token)) return true;
  
  // Se o token precisa ser atualizado, tenta atualizá-lo
  return await refreshCurrentToken();
}

export const tokenManager = {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
  isTokenValid,
  getTokenExpiration,
  getTokenPayload,
  refreshCurrentToken,
  ensureValidToken
};

export default tokenManager;