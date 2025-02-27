// src/pages/Tax/types/index.ts

// Definição principal da interface Tax
export interface Tax {
    id?: number;
    acronym: string;
    description: string;
    type: string;  // 'tax' | 'fee'
    group: string; // 'federal' | 'state' | 'municipal' | 'other'
    calc_operator: string; // '%' | '0' | '+' | '-' | '*' | '/'
    value: number;
  }
  
  // Constantes para rótulos de exibição
  export const TAX_TYPE_LABELS: Record<string, string> = {
    'tax': 'Imposto',
    'fee': 'Taxa'
  };
  
  export const TAX_GROUP_LABELS: Record<string, string> = {
    'federal': 'Federal',
    'state': 'Estadual',
    'municipal': 'Municipal',
    'other': 'Outro'
  };
  
  export const CALC_OPERATOR_LABELS: Record<string, string> = {
    '%': 'Percentual',
    '0': 'Fixo',
    '+': 'Adição',
    '-': 'Subtração',
    '*': 'Multiplicação',
    '/': 'Divisão'
  };
  
  // Interface para parâmetros de listagem
  export interface TaxListParams {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }
  
  // Função auxiliar para formatar o valor do imposto
  export const formatTaxValue = (value: number, calcOperator: string): string => {
    if (value == null) return '0.00';
    const formatted = value.toFixed(2);
    return calcOperator === '%' ? `${formatted}%` : formatted;
  };
  
  // Função auxiliar para obter o rótulo de um valor
  export const getOptionLabel = (
    value: string, 
    options: Record<string, string>
  ): string => {
    return options[value] || value;
  };