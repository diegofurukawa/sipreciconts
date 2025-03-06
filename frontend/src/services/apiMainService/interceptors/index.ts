// src/services/apiMainService/interceptors/index.ts
import { AxiosInstance } from 'axios';
import { setupRequestInterceptor } from './requestInterceptor';
import { setupResponseInterceptor } from './responseInterceptor';

/**
 * Configura todos os interceptors para uma instância do Axios
 * @param api Instância do Axios para configurar
 */
export function configureInterceptors(api: AxiosInstance): void {
  setupRequestInterceptor(api);
  setupResponseInterceptor(api);
}

export { 
  setupRequestInterceptor,
  setupResponseInterceptor
};

export default {
  configureInterceptors
};