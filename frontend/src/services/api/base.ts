// src/services/api/base.ts
import axios from 'axios';
import { setupInterceptors, setupRetry } from './utils';

const DEFAULT_CONFIG = {
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

export const api = axios.create(DEFAULT_CONFIG);

// Configure interceptors and retry
setupInterceptors(api);
setupRetry(api, {
  maxAttempts: 3,
  baseDelay: 1000,
  statusCodes: [408, 429, 500, 502, 503, 504]
});
export type ApiInstance = typeof api;


// import axios from 'axios';
// import { setupInterceptors } from './utils';
// import { setupRetry } from './utils';
// import type { ApiConfig } from './types';

// const DEFAULT_CONFIG: ApiConfig = {
//   baseURL: 'http://localhost:8000/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   }
// };

// export const api = axios.create(DEFAULT_CONFIG);

// // Configura interceptors e retry
// setupInterceptors(api);
// setupRetry(api, {
//   maxAttempts: 3,
//   baseDelay: 1000,
//   statusCodes: [408, 429, 500, 502, 503, 504]
// });

// export type ApiInstance = typeof api;
// export default api;