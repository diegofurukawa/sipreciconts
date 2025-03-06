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
  headerManager.clearAuthHeaders();
}

/**
 * Verifica se um token ainda é válido
 * @param token Token a ser verificado
 * @param bufferSeconds Tempo em segundos antes da expiração para considerar inválido
 * @returns true se o token for válido, false caso contrário
 */
function isTokenValid(token?: string | null, bufferSeconds: number = 30): boolean {
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
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
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
        
        return true;
      }
    } else {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh/`, {
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
          
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return false;
  }
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
  refreshCurrentToken
};

export default tokenManager;