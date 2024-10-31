// src/services/api/index.ts
import { ApiConfig } from './types';
import { AuthService } from './auth';
import { CustomerService } from './customer';
import { TaxService } from './tax';

const config: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};

// Criar instâncias dos serviços
const authService = new AuthService(config);
const customerService = new CustomerService(config);
const taxService = new TaxService(config);

// Exportar as classes
export { AuthService } from './auth';
export { CustomerService } from './customer';
export { TaxService } from './tax';

// Exportar as instâncias configuradas
export { authService, customerService, taxService };

// Exportar os tipos
export * from './types';
export type { AuthResponse } from './auth';
export type { Customer, CustomerResponse, ImportResponse } from './customer';
export type { Tax } from './tax';