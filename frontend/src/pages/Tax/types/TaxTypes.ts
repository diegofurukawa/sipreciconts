// Interfaces
export interface Tax {
  tax_id?: number;
  acronym: string;
  description?: string;
  type: string;
  group: string;
  calc_operator: string;
  value: number;
  created?: string;
  updated?: string;
}

export interface TaxListParams {
  page?: number;
  page_size?: number;
  search?: string;
  type?: string;
  group?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Labels para exibição
export const TAX_TYPE_LABELS: Record<string, string> = {
  'tax': 'Imposto',
  'fee': 'Taxa'
};

// Opções para selects
export const TAX_TYPE_OPTIONS = [
  { value: 'tax', label: 'Imposto' },
  { value: 'fee', label: 'Taxa' }
];


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