// src/services/apiMainService/interceptors/requestInterceptor.ts
import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AxiosHeaders } from 'axios';
import { tokenManager } from '@/services/apiMainService/auth';
import { headerManager } from '@/services/apiMainService/headers';
import { logRequest } from '@/services/apiMainService/utils/logger';

/**
 * Configura o interceptor de requisição
 * @param api Instância do Axios
 */
export function setupRequestInterceptor(api: AxiosInstance): void {
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Registra a requisição (em ambientes de desenvolvimento)
      if (process.env.NODE_ENV !== 'production') {
        logRequest(config);
      }

      // Cria um objeto AxiosHeaders para garantir tipagem correta
      const headers = new AxiosHeaders(config.headers);

      // Verifica e atualiza o token se necessário
      await ensureValidToken(headers);

      // Adiciona headers padrão e customizados
      const baseHeaders = headerManager.getHeaders();
      Object.keys(baseHeaders).forEach(key => {
        if (baseHeaders[key]) {
          headers.set(key, baseHeaders[key]);
        }
      });

      // Atualiza os headers da config
      config.headers = headers;
      
      return config;
    },
    (error) => Promise.reject(error)
  );
}

/**
 * Verifica e atualiza o token se necessário
 * @param headers Cabeçalhos da requisição
 */
async function ensureValidToken(headers: AxiosHeaders): Promise<void> {
  const token = tokenManager.getAccessToken();
  
  if (token) {
    // Verifica se o token está expirado ou prestes a expirar
    if (!tokenManager.isTokenValid(token)) {
      // Tenta atualizar o token
      const refreshed = await tokenManager.refreshCurrentToken();
      if (refreshed) {
        const newToken = tokenManager.getAccessToken();
        headers.set('Authorization', `Bearer ${newToken}`);
      }
    } else {
      // Token ainda é válido
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
}

export default {
  setupRequestInterceptor
};