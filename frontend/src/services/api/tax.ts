// src/services/api/tax.ts
import { api, handleApiError } from './utils';
import { PaginatedResponse } from './types';
import { Tax } from '../../types/tax';

export const TaxService = {
  /**
   * Lista todos os impostos cadastrados
   */
  list: async (): Promise<Tax[]> => {
    try {
      const response = await api.get<PaginatedResponse<Tax>>('/taxes/');
      return response.data.results;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Busca um imposto específico pelo ID
   */
  get: async (id: number): Promise<Tax> => {
    try {
      const response = await api.get<Tax>(`/taxes/${id}/`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Cria um novo imposto
   */
  create: async (data: Partial<Tax>): Promise<Tax> => {
    try {
      const response = await api.post<Tax>('/taxes/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Atualiza um imposto existente
   */
  update: async (id: number, data: Partial<Tax>): Promise<Tax> => {
    try {
      const response = await api.put<Tax>(`/taxes/${id}/`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Remove um imposto (soft delete)
   */
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/taxes/${id}/`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Importa impostos a partir de um arquivo CSV
   */
  import: async (file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/taxes/import/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Exporta impostos para um arquivo CSV
   */
  export: async (): Promise<void> => {
    try {
      const response = await api.get('/taxes/export/', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'impostos.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Busca impostos por tipo
   */
  getByType: async (type: Tax['type']): Promise<Tax[]> => {
    try {
      const response = await api.get<PaginatedResponse<Tax>>('/taxes/', {
        params: { type }
      });
      return response.data.results;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Calcula o valor do imposto para um determinado valor
   */
  calculate: async (taxId: number, amount: number): Promise<{ value: number }> => {
    try {
      const response = await api.post<{ value: number }>(`/taxes/${taxId}/calculate/`, {
        amount
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Ativa ou desativa um imposto
   */
  toggleStatus: async (id: number, enabled: boolean): Promise<Tax> => {
    try {
      const response = await api.patch<Tax>(`/taxes/${id}/toggle_status/`, {
        enabled
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Busca impostos aplicáveis a um determinado serviço ou produto
   */
  getApplicableTaxes: async (serviceId: number): Promise<Tax[]> => {
    try {
      const response = await api.get<PaginatedResponse<Tax>>(`/taxes/applicable/${serviceId}/`);
      return response.data.results;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Atualiza o percentual de vários impostos de uma vez
   */
  bulkUpdatePercentage: async (updates: { id: number; percentage: number }[]): Promise<Tax[]> => {
    try {
      const response = await api.put<Tax[]>('/taxes/bulk_update/', { updates });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Adicionar uma exportação default para maior flexibilidade
export default TaxService;