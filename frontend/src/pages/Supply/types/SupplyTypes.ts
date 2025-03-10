// src/pages/Supply/types/SupplyTypes.ts

/**
 * Interface base do Insumo
 */
export interface Supply {
    id?: number;
    name: string;
    nick_name?: string;
    ean_code?: string;
    description?: string;
    type: string;
    type_display?: string;
    unit_measure: string;
    unit_measure_display?: string;
    enabled?: boolean;
    created?: string;
    updated?: string;
  }
  
  /**
   * Parâmetros para listagem de insumos
   */
  export interface SupplyListParams {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    type?: string;
    unit_measure?: string;
    enabled?: boolean;
  }
  
  /**
   * Resposta paginada da API
   */
  export interface PaginatedResponse<T> {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
  }
  
  /**
   * Tipos de insumos disponíveis no sistema
   */
  export const SUPPLY_TYPES = [
    { value: 'MAT', label: 'Material' },
    { value: 'EQUIP', label: 'Equipamento' },
    { value: 'SERV', label: 'Serviço' },
    { value: 'OTHER', label: 'Outro' }
  ];
  
  /**
   * Unidades de medida disponíveis no sistema
   */
  export const UNIT_MEASURES = [
    { value: 'UN', label: 'Unidade' },
    { value: 'KG', label: 'Quilograma' },
    { value: 'L', label: 'Litro' },
    { value: 'M', label: 'Metro' },
    { value: 'M2', label: 'Metro Quadrado' },
    { value: 'M3', label: 'Metro Cúbico' },
    { value: 'HR', label: 'Hora' },
    { value: 'DAY', label: 'Dia' }
  ];
  
  /**
   * Resposta de importação de insumos
   */
  export interface SupplyImportResponse {
    total_processed: number;
    success_count: number;
    error_count: number;
    errors?: Array<{
      row: number;
      message: string;
      data: Record<string, any>;
    }>;
  }