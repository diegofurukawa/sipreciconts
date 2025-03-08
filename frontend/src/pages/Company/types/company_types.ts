// src/pages/Company/types/company_types.ts

/**
 * Interface base da Empresa
 */
export interface Company {
  company_id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  address?: string;
  enabled: boolean;
  created?: string;
  updated?: string;
  administrators_count?: number;
  employees_count?: number;
}

/**
 * Parâmetros para listagem de empresas
 */
export interface CompanyListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  enabled?: boolean;
}

/**
 * Opcional: Labels para exibição
 */
export const COMPANY_TYPE_LABELS: Record<string, string> = {
  'matriz': 'Matriz',
  'filial': 'Filial',
  'fornecedor': 'Fornecedor',
  'cliente': 'Cliente'
};

/**
 * Opcional: Opções para selects
 */
export const COMPANY_TYPE_OPTIONS = [
  { value: 'matriz', label: 'Matriz' },
  { value: 'filial', label: 'Filial' },
  { value: 'fornecedor', label: 'Fornecedor' },
  { value: 'cliente', label: 'Cliente' }
];

/**
 * Funções auxiliares para formatação
 */
export const formatDocument = (document?: string): string => {
  if (!document) return '-';
  
  // Formata CNPJ: XX.XXX.XXX/XXXX-XX
  if (document.length === 14) {
    return document.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }
  
  // Formata CPF: XXX.XXX.XXX-XX
  if (document.length === 11) {
    return document.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      '$1.$2.$3-$4'
    );
  }
  
  return document;
};

export const getOptionLabel = (value: string, optionsRecord: Record<string, string>): string => {
  if (!value) return '';
  return optionsRecord[value] || value;
};