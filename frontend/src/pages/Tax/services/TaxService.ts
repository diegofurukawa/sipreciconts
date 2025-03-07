// src/pages/Tax/services/TaxService.ts
import axios from 'axios';
import { DEFAULT_API_CONFIG } from '@/services/apiMainService/config';
import type { PaginatedResponse } from '@/types/api_types';
import type { Tax, TaxListParams } from '@/pages/Tax/types/tax_types';

// URL base para o serviço de impostos (removida a barra final para evitar duplicação)
const baseUrl = DEFAULT_API_CONFIG.baseURL.endsWith('/')
  ? `${DEFAULT_API_CONFIG.baseURL}taxes` // Remove a barra final se existir
  : `${DEFAULT_API_CONFIG.baseURL}/taxes`;

// Função para obter headers com autenticação
const getHeaders = () => {
  const token = localStorage.getItem('access_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Adiciona company_id se disponível
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.company_id) {
        headers['X-Company-ID'] = userData.company_id;
      }
    } catch (e) {
      console.error('Erro ao recuperar dados do usuário:', e);
    }
  }

  return headers;
};

// Serviço de impostos baseado em objeto literal
export const taxService = {
  /**
   * Lista todos os impostos cadastrados
   */
  async list(params?: TaxListParams): Promise<PaginatedResponse<Tax>> {
    console.log('Carregando impostos com parâmetros:', params);
    try {
      const response = await axios.get(`${baseUrl}/`, {
        headers: getHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar impostos:', error);
      throw error;
    }
  },

  /**
   * Busca um imposto específico pelo ID
   */
  async getById(id: number): Promise<Tax> {
    if (id === undefined || id === null || isNaN(id)) {
      throw new Error('ID do imposto inválido');
    }
    try {
      const response = await axios.get(`${baseUrl}/${id}/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar imposto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria um novo imposto
   */
  async create(data: Omit<Tax, 'id' | 'created' | 'updated'>): Promise<Tax> {
    try {
      const response = await axios.post(`${baseUrl}/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar imposto:', error);
      throw error;
    }
  },

  /**
   * Atualiza um imposto existente
   */
  async update(id: number, data: Partial<Tax>): Promise<Tax> {
    try {
      const response = await axios.put(`${baseUrl}/${id}/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar imposto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Remove um imposto (soft delete)
   */
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${baseUrl}/${id}/`, {
        headers: getHeaders(),
      });
    } catch (error) {
      console.error(`Erro ao excluir imposto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Importa impostos a partir de um arquivo
   */
  async import(file: File, onProgress?: (percentage: number) => void): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const config = {
        headers: {
          ...getHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentage);
          }
        },
      };

      const response = await axios.post(`${baseUrl}/import`, formData, config);
      return response.data;
    } catch (error) {
      console.error('Erro ao importar impostos:', error);
      throw error;
    }
  },

  /**
   * Exporta impostos
   */
  async export(format: 'csv' | 'xlsx' = 'xlsx'): Promise<Blob> {
    try {
      const response = await axios.get(`${baseUrl}/export`, {
        headers: {
          ...getHeaders(),
          'Accept': format === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv',
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar impostos:', error);
      throw error;
    }
  },

  /**
   * Valida dados do imposto
   */
  async validate(data: Partial<Tax>): Promise<{
    valid: boolean;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await axios.post(`${baseUrl}/validate`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao validar dados do imposto:', error);
      throw error;
    }
  },
};

// Exportar como default para compatibilidade
export default taxService;