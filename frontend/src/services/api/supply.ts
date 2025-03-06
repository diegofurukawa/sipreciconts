// src/services/supplyService.ts
import { Supply } from '../../types/supply';
import { ApiService } from '@/services/apiMainService';
import type { Supply, SupplyCreateData, SupplyUpdateData } from '../../types/api.types';
import type { PaginatedResponse } from '../../types';

interface SupplyFilterParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  enabled?: boolean;
  sort_by?: string;
}

export class SupplyService extends ApiService {
  private readonly basePath = '/supplies';

  /**
   * Lista insumos com paginação e filtros
   */
  async list(params?: SupplyFilterParams): Promise<PaginatedResponse<Supply>> {
    return this.getPaginated<Supply>(this.basePath, params);
  }

  /**
   * Busca um insumo pelo ID
   */
  async getById(id: number): Promise<Supply> {
    return this.get<Supply>(`${this.basePath}/${id}`);
  }

  /**
   * Cria um novo insumo
   */
  async create(data: SupplyCreateData): Promise<Supply> {
    return this.post<Supply>(this.basePath, data);
  }

  /**
   * Atualiza um insumo existente
   */
  async update(id: number, data: SupplyUpdateData): Promise<Supply> {
    return this.put<Supply>(`${this.basePath}/${id}`, data);
  }

  /**
   * Exclui um insumo
   */
  async delete(id: number): Promise<void> {
    return this.delete(`${this.basePath}/${id}`);
  }

  /**
   * Importa insumos a partir de um arquivo
   */
  async import(file: File, onProgress?: (percentage: number) => void): Promise<void> {
    return this.uploadFile(
      `${this.basePath}/import/`,
      file,
      onProgress
    );
  }

  /**
   * Exporta insumos para um arquivo CSV
   */
  async export(filename: string = 'insumos.csv'): Promise<void> {
    return this.downloadAndSaveFile(
      `${this.basePath}/export/`,
      filename,
      'csv'
    );
  }

  /**
   * Pesquisa insumos
   */
  async search(query: string, params?: Omit<SupplyFilterParams, 'search'>): Promise<PaginatedResponse<Supply>> {
    return this.list({
      ...params,
      search: query
    });
  }

  /**
   * Exclui múltiplos insumos
   */
  async bulkDelete(ids: number[]): Promise<void> {
    return this.post(`${this.basePath}/bulk-delete/`, { ids });
  }
}

// Cria e exporta uma instância única do serviço
export const supplyService = new SupplyService();

// Tipos
// src/services/api/modules/supply/types.ts
export interface Supply {
  id: number;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  unit_price: number;
  unit: string;
  enabled: boolean;
  created: string;
  updated: string;
}

export interface SupplyCreateData extends Omit<Supply, 'id' | 'created' | 'updated'> {
  name: string;
  unit_price: number;
  unit: string;
}

export interface SupplyUpdateData extends Partial<SupplyCreateData> {}

// Re-exporta os tipos
export type { 
  Supply,
  SupplyCreateData,
  SupplyUpdateData,
  SupplyFilterParams
};