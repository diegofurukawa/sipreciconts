// src/services/api/modules/tax.ts
import { ApiService } from "@/services/api/ApiService";
import type { PaginatedResponse } from '@/types/api.types';
import type { Tax, TaxListParams } from '@/pages/Tax/types/tax_types';;

class TaxApiService extends ApiService {
  // Corrigindo o caminho do API para usar o proxy Vite
  private readonly baseUrl = '/taxes/';

  /**
   * Lista todos os impostos cadastrados
   */
  async list(params?: TaxListParams): Promise<PaginatedResponse<Tax>> {
    // Usando um console.log para depuração
    console.log('Chamando API de impostos:', this.baseUrl);
    try {
      const response = await this.getPaginated<Tax>(this.baseUrl, params);
      console.log('Resposta recebida:', response);
      return response;
    } catch (error) {
      console.error('Erro ao listar impostos:', error);
      throw error;
    }
  }

  /**
   * Busca um imposto específico pelo ID
   */
  async getById(id: number): Promise<Tax> {
    if (id === undefined || id === null || isNaN(id)) {
      throw new Error('ID do imposto inválido');
    }
    return this.get<Tax>(`${this.baseUrl}${id}/`);
  }

  /**
   * Cria um novo imposto
   */
  async create(data: Omit<Tax, 'id' | 'created' | 'updated'>): Promise<Tax> {
    return this.post<Tax>(`${this.baseUrl}`, data);
  }

  /**
   * Atualiza um imposto existente
   */
  async update(id: number, data: Partial<Tax>): Promise<Tax> {
    return this.put<Tax>(`${this.baseUrl}${id}/`, data);
  }

  /**
   * Remove um imposto (soft delete)
   */
  async delete(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}${id}/`);
  }

  /**
   * Importa impostos a partir de um arquivo
   */
  async import(file: File, onProgress?: (percentage: number) => void): Promise<any> {
    return this.uploadFile(
      `${this.baseUrl}/import/`,
      file,
      onProgress
    );
  }

  /**
   * Exporta impostos
   */
  async export(format: 'csv' | 'xlsx' = 'xlsx'): Promise<Blob> {
    return this.downloadFile(
      `${this.baseUrl}/export/`,
      `impostos.${format}`,
      format
    );
  }

  /**
   * Valida dados do imposto
   */
  async validate(data: Partial<Tax>): Promise<{
    valid: boolean;
    errors?: Record<string, string[]>;
  }> {
    return this.post(`${this.baseUrl}/validate/`, data);
  }
}

// Exporta instância única do serviço
export const taxService = new TaxApiService();