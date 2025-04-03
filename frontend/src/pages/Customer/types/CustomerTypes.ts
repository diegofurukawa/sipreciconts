// src/pages/Customer/types/index.ts

/**
 * Interface base do Cliente
 */
export interface Customer {
  company_id?: string; // Added company field
  customer_id?: string;
  name: string;
  document?: string;
  customer_type?: string;
  celphone: string;
  email?: string;
  address?: string;
  complement?: string;
  enabled?: boolean;
  created?: string;
  updated?: string;
  
}

export interface PaginatedResponse<T> {
  results: T[] | { results: T[]; total_count?: number };
  count?: number;
  next?: string | null;
  previous?: string | null;
  current_page?: number;
  total_pages?: number;
  total?: number;
}

/**
 * Dados para criação de cliente
 */
export interface CustomerCreateData extends Omit<Customer, 'customer_id' | 'enabled' | 'created' | 'updated'> {}

/**
 * Dados para atualização de cliente
 */
export interface CustomerUpdateData extends Partial<CustomerCreateData> {}

/**
 * Parâmetros para listagem de clientes
 */
export interface CustomerListParams {
  company_id?: string;
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  document?: string;
  email?: string;
  customer_type?: string;
  enabled?: boolean;
  created_after?: string;
  created_before?: string;
}

export interface CustomerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Customer[];
}

/**
 * Resposta da importação de clientes
 */
export interface CustomerImportResponse {
  total_processed: number;
  success_count: number;
  error_count: number;
  errors?: Array<{
    row: number;
    message: string;
    data: Record<string, any>;
  }>;
}

/**
 * Opções para exportação de clientes
 */
export interface CustomerExportOptions {
  format?: 'csv' | 'xlsx';
  fields?: string[];
  include_disabled?: boolean;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface CustomerResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export const getOptionLabel = (value: string, optionsRecord: Record<string, string>): string => {
  if (!value) return '';
  return optionsRecord[value] || value;
};


export const CUSTOMER_TYPE_LABELS: Record<string, string> = {
  'business': 'Empresarial',
  'individual': 'Individual',
  
};