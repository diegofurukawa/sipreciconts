// src/types/supply.ts
export interface Supply {
    id?: number;
    name: string;
    nick_name?: string;
    ean_code?: string;
    description?: string;
    unit_measure: 'UN' | 'KG' | 'ML';
    unit_measure_display?: string;
    type: 'VEI' | 'ARM' | 'MAT' | 'UNI';
    type_display?: string;
    enabled?: boolean;
    created?: string;
    updated?: string;
}

export const UNIT_MEASURES = [
    { value: 'UN', label: 'Unidade' },
    { value: 'KG', label: 'Kilograma' },
    { value: 'ML', label: 'Mililitro' }
] as const;

export const SUPPLY_TYPES = [
    { value: 'VEI', label: 'Veículo' },
    { value: 'ARM', label: 'Armamento' },
    { value: 'MAT', label: 'Material' },
    { value: 'UNI', label: 'Uniforme' }
] as const;