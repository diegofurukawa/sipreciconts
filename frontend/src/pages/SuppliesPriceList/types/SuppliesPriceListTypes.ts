// src/pages/SuppliesPriceList/types/SuppliesPriceListTypes.ts

/**
 * Interface for SuppliesPriceList item
 */
export interface SuppliesPriceList {
    suppliespricelist_id?: number;
    supply: number;
    supply_name?: string;
    tax: number;
    tax_acronym?: string;
    value: number | string;
    sequence?: number;
    company_id?: string;
    created?: string;
    updated?: string;
    enabled?: boolean;
  }
  
  /**
   * Parameters for listing supplies price list
   */
  export interface SuppliesPriceListParams {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    supply?: number;
    tax?: number;
    company_id?: string;
    enabled?: boolean;
  }
  
  /**
   * Paginated API response
   */
  export interface PaginatedResponse<T> {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
  }
  
  /**
   * Supply selection interface for dropdown
   */
  export interface SupplyOption {
    id: number;
    name: string;
    type: string;
    type_display?: string;
    unit_measure: string;
    unit_measure_display?: string;
  }
  
  /**
   * Tax selection interface for dropdown
   */
  export interface TaxOption {
    tax_id: number;
    acronym: string;
    type: string;
    group: string;
    calc_operator: string;
    value: number;
  }
  
  /**
   * Helper functions for formatting
   */
  export const formatCurrency = (value: number | string): string => {
    if (value === null || value === undefined) return 'R$ 0,00';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };
  
  export const formatDate = (date?: string): string => {
    if (!date) return '-';
    
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return date;
    }
  };