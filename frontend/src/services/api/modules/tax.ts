// src/services/api/modules/tax.ts
import { ApiService } from '../ApiService';
import type { PaginatedResponse, ApiResponse } from '../../../types/api.types';
import type { Tax } from '@/types/tax';

export interface TaxCreateData extends Omit<Tax, 'id' | 'created' | 'updated'> {
  name: string;
  type: string;
  percentage: number;
}

export interface TaxUpdateData extends Partial<TaxCreateData> {}

export interface TaxCalculationResult {
  value: number;
  details?: {
    base: number;
    rate: number;
    additions?: number;
    deductions?: number;
  };
}

export interface TaxListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: 'active' | 'inactive';
  min_percentage?: number;
  max_percentage?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

class TaxApiService extends ApiService {
  private readonly baseUrl = '/taxes';

  /**
   * Lista todos os impostos cadastrados
   */
  async list(params?: TaxListParams): Promise<PaginatedResponse<Tax>> {
    return this.getPaginated<Tax>(this.baseUrl, params);
  }

  /**
   * Busca um imposto específico pelo ID
   */
  async getById(id: number): Promise<Tax> {
    return this.get<Tax>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria um novo imposto
   */
  async create(data: TaxCreateData): Promise<Tax> {
    return this.post<Tax>(this.baseUrl, data);
  }

  /**
   * Atualiza um imposto existente
   */
  async update(id: number, data: TaxUpdateData): Promise<Tax> {
    return this.put<Tax>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Remove um imposto (soft delete)
   */
  async delete(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Importa impostos a partir de um arquivo
   */
  async import(file: File, onProgress?: (percentage: number) => void): Promise<ApiResponse> {
    return this.uploadFile(
      `${this.baseUrl}/import`,
      file,
      onProgress
    );
  }

  /**
   * Exporta impostos
   */
  async export(params?: {
    format?: 'csv' | 'xlsx';
    includeInactive?: boolean;
  }): Promise<Blob> {
    const response = await this.api.get(`${this.baseUrl}/export`, {
      params,
      responseType: 'blob',
      headers: {
        ...this.getHeaders(),
        Accept: params?.format === 'xlsx' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv'
      }
    });
    return response.data;
  }

  /**
   * Busca impostos por tipo
   */
  async getByType(type: Tax['type']): Promise<Tax[]> {
    return this.get<Tax[]>(`${this.baseUrl}/by-type/${type}`);
  }

  /**
   * Calcula o valor do imposto
   */
  async calculate(taxId: number, amount: number): Promise<TaxCalculationResult> {
    return this.post<TaxCalculationResult>(`${this.baseUrl}/${taxId}/calculate`, {
      amount
    });
  }

  /**
   * Ativa/desativa imposto
   */
  async toggleStatus(id: number, enabled: boolean): Promise<Tax> {
    return this.patch<Tax>(`${this.baseUrl}/${id}/toggle-status`, {
      enabled
    });
  }

  /**
   * Busca impostos aplicáveis
   */
  async getApplicable(serviceId: number): Promise<Tax[]> {
    return this.get<Tax[]>(`${this.baseUrl}/applicable/${serviceId}`);
  }

  /**
   * Atualização em lote
   */
  async bulkUpdate(updates: Array<{ id: number; percentage: number }>): Promise<Tax[]> {
    return this.put<Tax[]>(`${this.baseUrl}/bulk-update`, { updates });
  }

  /**
   * Valida dados do imposto
   */
  async validate(data: Partial<TaxCreateData>): Promise<{
    valid: boolean;
    errors?: Record<string, string[]>;
  }> {
    return this.post(`${this.baseUrl}/validate`, data);
  }

  /**
   * Obtém estatísticas dos impostos
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    average_rate: number;
    total_collected: number;
  }> {
    return this.get(`${this.baseUrl}/stats`);
  }
}

// Exporta instância única do serviço
export const taxService = new TaxApiService();

// Exporta classe para casos de uso específicos
export default TaxApiService;