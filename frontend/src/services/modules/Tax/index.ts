// src/services/api/modules/Tax/index.ts
import axios from 'axios';
import { APP_CONFIG } from '@/config';

// Interfaces
export interface Tax {
  id?: number;
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

// Usando abordagem baseada em funções para evitar problemas de inicialização
const baseUrl = `${APP_CONFIG.api.baseURL}/taxes`;

// Headers padrão
const getHeaders = () => {
  const token = localStorage.getItem('token');
  
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

// Serviço de impostos
export const taxService = {
  /**
   * Lista todos os impostos cadastrados
   */
  async list(params?: TaxListParams): Promise<PaginatedResponse<Tax>> {
    try {
      const response = await axios.get(baseUrl, {
        headers: getHeaders(),
        params
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
    try {
      const response = await axios.get(`${baseUrl}/${id}`, {
        headers: getHeaders()
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
      const response = await axios.post(baseUrl, data, {
        headers: getHeaders()
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
      const response = await axios.put(`${baseUrl}/${id}`, data, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar imposto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Remove um imposto
   */
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${baseUrl}/${id}`, {
        headers: getHeaders()
      });
    } catch (error) {
      console.error(`Erro ao excluir imposto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Importa impostos a partir de um arquivo
   */
  async import(file: File, options?: { update_existing?: boolean, skip_errors?: boolean }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (options?.update_existing) {
        formData.append('update_existing', 'true');
      }
      
      if (options?.skip_errors) {
        formData.append('skip_errors', 'true');
      }
      
      const response = await axios.post(`${baseUrl}/import`, formData, {
        headers: {
          ...getHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao importar impostos:', error);
      throw error;
    }
  },

  /**
   * Exporta impostos para arquivo
   */
  async export(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      const response = await axios.get(`${baseUrl}/export`, {
        headers: {
          ...getHeaders(),
          'Accept': format === 'xlsx' 
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv'
        },
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar impostos:', error);
      throw error;
    }
  }
};