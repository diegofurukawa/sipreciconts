// src/services/api/index.ts
// Core exports
export { ApiService, apiService, createApiService } from './ApiService';
// Service instances exports
export { authService } from './modules/auth';
export { customerService } from './modules/customer';
export { companyService } from './modules/company';
export { taxService } from './modules/tax';

// Token service
import { TokenService, UserSessionService, useAuth } from '@/core/auth';

// Utils exports
export { 
  errorUtils, 
  retryUtils,
  handleApiError,
  handleApiErrorWithCallback,
  setupInterceptors 
} from './utils';

// Constants exports
export {
  API_CONFIG,
  RETRY_CONFIG,
  ERROR_MESSAGES,
  HTTP_STATUS,
  API_CONSTANTS,
  // Types
  type ApiConfig,
  type RetryConfig,
  type ErrorMessages,
  type HttpStatus,
  type ApiConstants
} from './constants';

// Type exports
export type {
  ApiResponse,
  ApiError,
  ApiErrorCode,
  CustomRequestHeaders,
  PaginatedResponse,
} from './types';

// Module types exports
export type {
  AuthCredentials,
  AuthResponse,
  AuthState,
  AuthUser
} from './modules/auth';

export type {
  Customer,
  CustomerCreateData,
  CustomerUpdateData,
  CustomerListParams
} from './modules/customer';

export type {
  Company,
  CompanyCreateData,
  CompanyUpdateData,
  CompanySettings
} from './modules/company';

export type {
  Tax,
  TaxCreateData,
  TaxUpdateData
} from './modules/tax';