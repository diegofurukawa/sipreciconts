// src/services/api/index.ts
// Core exports
export { ApiService, apiService, createApiService } from './ApiService';
// Service instances exports
export { authService } from '../../auth/services/authService';
export { customerService } from '../modules/customer';
export { companyService } from '../modules/company';
// export { taxService } from '@/services/modules/Tax';
export { taxService } from '@/pages/Tax/services/TaxService';

// Token service
export { TokenService } from '../../auth/services/TokenService';
export { UserSessionService } from '@/auth/services/UserSessionService';
// import { useAuth } from '@/contexts/AuthContext';

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
} from '@/types/api.types';

// Module types exports
export type {
  AuthCredentials,
  AuthResponse,
  AuthState,
  AuthUser
} from '../../auth/services/authService';