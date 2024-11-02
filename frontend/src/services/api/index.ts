// Base exports
export { api } from './base';
export type { ApiInstance } from './base';
export { AuthService } from './auth';
export { TokenService } from './token';

// Service exports
export { CustomerService } from './customer';
export { TaxService } from './tax';
export { CompanyService } from './company';


// Type exports
//export type { Customer } from './customer';
//export type { Tax } from './tax';
export type * from './types';

// Utils exports
export {
  handleApiError,
  handleApiErrorWithCallback,
  isAuthError,
  isNetworkError,
  formatErrorMessage
} from './utils';