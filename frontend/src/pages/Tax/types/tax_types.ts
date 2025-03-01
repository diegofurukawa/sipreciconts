// src/pages/Tax/types/index.ts
export interface Tax {
  id?: number;
  acronym: string;
  description: string;
  type: string;  // 'tax' | 'fee'
  group: string; // 'federal' | 'state' | 'municipal' | 'other'
  calc_operator: string; // '%' | '0' | '+' | '-' | '*' | '/'
  value: number;
  enabled?: boolean;
  created?: string;
  updated?: string;
}

export interface TaxListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Labels para exibição
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

// Opções para selects
export const TAX_TYPE_OPTIONS = [
  { value: 'tax', label: 'Imposto' },
  { value: 'fee', label: 'Taxa' }
];

export const TAX_GROUP_OPTIONS = [
  { value: 'federal', label: 'Federal' },
  { value: 'state', label: 'Estadual' },
  { value: 'municipal', label: 'Municipal' },
  { value: 'other', label: 'Outro' }
];

export const CALC_OPERATOR_OPTIONS = [
  { value: '%', label: 'Percentual' },
  { value: '0', label: 'Fixo' },
  { value: '+', label: 'Adição' },
  { value: '-', label: 'Subtração' },
  { value: '*', label: 'Multiplicação' },
  { value: '/', label: 'Divisão' }
];

// Funções auxiliares
export const formatTaxValue = (value: number | string, calcOperator: string): string => {
  // Verifica se value é null, undefined ou não é um número
  if (value == null) return '0.00';
  
  // Converte para número se for string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Verifica se é um número válido após a conversão
  if (isNaN(numValue)) return '0.00';
  
  // Formata com duas casas decimais
  const formatted = numValue.toFixed(2);
  
  // Adiciona símbolo de percentual quando necessário
  return calcOperator === '%' ? `${formatted}%` : formatted;
};

export const getOptionLabel = (value: string, optionsRecord: Record<string, string>): string => {
  if (!value) return '';
  return optionsRecord[value] || value;
};