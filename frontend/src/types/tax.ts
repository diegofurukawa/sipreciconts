// src/types/tax.ts

// src/types/tax.ts
export interface Tax {
    id?: number;
    acronym: string;
    description?: string;
    type: string; // 'tax' | 'fee'
    group: string; // 'federal' | 'state' | 'municipal' | 'other'
    calc_operator: string; // '%' | '0' | '+' | '-' | '*' | '/'
    value: number;
    company_id: string; // Added company field
  }

export const TAX_TYPES = {
    TAX: 'tax',
    FEE: 'fee'
} as const;

export const TAX_GROUPS = {
    FEDERAL: 'federal',
    STATE: 'state',
    MUNICIPAL: 'municipal',
    OTHER: 'other'
} as const;

export const CALC_OPERATORS = {
    PERCENTAGE: '%',
    FIXED: '0',
    ADDITION: '+',
    SUBTRACTION: '-',
    MULTIPLICATION: '*',
    DIVISION: '/'
} as const;

// Labels para exibição
export const TAX_TYPE_LABELS = {
    [TAX_TYPES.TAX]: 'Imposto',
    [TAX_TYPES.FEE]: 'Taxa'
};

export const TAX_GROUP_LABELS = {
    [TAX_GROUPS.FEDERAL]: 'Federal',
    [TAX_GROUPS.STATE]: 'Estadual',
    [TAX_GROUPS.MUNICIPAL]: 'Municipal',
    [TAX_GROUPS.OTHER]: 'Outro'
};

export const CALC_OPERATOR_LABELS = {
    [CALC_OPERATORS.PERCENTAGE]: 'Percentual',
    [CALC_OPERATORS.FIXED]: 'Fixo',
    [CALC_OPERATORS.ADDITION]: 'Adição',
    [CALC_OPERATORS.SUBTRACTION]: 'Subtração',
    [CALC_OPERATORS.MULTIPLICATION]: 'Multiplicação',
    [CALC_OPERATORS.DIVISION]: 'Divisão'
};