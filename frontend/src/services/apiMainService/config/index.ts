// src/services/apiMainService/config/index.ts
import apiConfig, { 
    getApiConfig, 
    DEFAULT_API_CONFIG, 
    HTTP_STATUS, 
    ERROR_MESSAGES,
    type ApiConfig,
    type RetryConfig,
    type RequestOptions,
    type ApiResponse,
    type PaginatedResponse
  } from './apiConfig';
  
  // Exportar funções e constantes
  export {
    getApiConfig,
    DEFAULT_API_CONFIG,
    HTTP_STATUS,
    ERROR_MESSAGES
  };
  
  // Exportar tipos
  export type {
    ApiConfig,
    RetryConfig,
    RequestOptions,
    ApiResponse,
    PaginatedResponse
  };
  
  // Exportação padrão
  export default apiConfig;
