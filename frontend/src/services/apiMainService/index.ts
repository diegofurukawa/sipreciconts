// src/services/apiMainService/index.ts
import { ApiService } from '@/services/apiMainService/ApiService';
import { headerManager } from '@/services/apiMainService/headers';
import { errorHandler, retryManager } from '@/services/apiMainService/utils';

// Criar e exportar uma instância padrão
export const apiService = new ApiService();

// Exportar a classe para casos onde é necessário criar instâncias personalizadas
export { ApiService };

// Exportar outros utilitários
export {
  headerManager,
  errorHandler,
  retryManager
};

// Exportar tipos
export type { 
  RequestOptions, 
  ApiConfig, 
  ApiResponse,
  PaginatedResponse 
} from '@/services/apiMainService/config/apiConfig';

// Exportação padrão
export default apiService;