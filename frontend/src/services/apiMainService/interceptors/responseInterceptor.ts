// src/services/apiMainService/interceptors/responseInterceptor.ts
import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { tokenManager } from '@/services/apiMainService/auth';
import { errorHandler } from '@/services/apiMainService/utils';
import { retryManager } from '@/services/apiMainService/utils';
import { logResponse, logError } from '@/services/apiMainService/utils/logger';

/**
 * Configura o interceptor de resposta
 * @param api Instância do Axios
 */
export function setupResponseInterceptor(api: AxiosInstance): void {
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      // Registra a resposta (em ambientes de desenvolvimento)
      if (process.env.NODE_ENV !== 'production') {
        logResponse(response);
      }
      
      return response;
    },
    async (error: AxiosError) => {
      // Registra o erro (em ambientes de desenvolvimento)
      if (process.env.NODE_ENV !== 'production') {
        logError(error);
      }

      // Se o erro não tiver uma config (por exemplo, erro de rede), rejeita imediatamente
      if (!error.config) {
        return Promise.reject(errorHandler.handleApiError(error));
      }

      // Trata erros de autenticação (401)
      if (error.response?.status === 401) {
        try {
          // Não tenta renovar token se a URL é de refresh ou login
          const isAuthUrl = error.config.url?.includes('/auth/');
          if (!isAuthUrl && !error.config._retry) {
            error.config._retry = true;
            
            // Tenta renovar o token
            const refreshed = await tokenManager.refreshCurrentToken(api);
            if (refreshed) {
              // Reenviar a requisição original com o novo token
              return api(error.config);
            }
          }
          
          // Se chegou aqui, não conseguiu renovar o token
          // ou a URL já é de autenticação (evita loop infinito)
          notifySessionExpired();
        } catch (refreshError) {
          // Erro ao tentar renovar o token
          notifySessionExpired();
        }
      }

      // Tenta retry para alguns códigos de erro
      if (retryManager.shouldRetry(error)) {
        try {
          return await retryManager.retryRequest(api, error.config);
        } catch (retryError) {
          return Promise.reject(errorHandler.handleApiError(retryError));
        }
      }

      // Rejeita com erro tratado
      return Promise.reject(errorHandler.handleApiError(error));
    }
  );
}

/**
 * Notifica que a sessão expirou
 */
function notifySessionExpired(): void {
  // Limpa os tokens
  tokenManager.clearTokens();
  
  // Dispara evento para a aplicação
  window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
}

export default {
  setupResponseInterceptor
};