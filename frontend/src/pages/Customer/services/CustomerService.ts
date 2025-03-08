import axios from 'axios';
import { DEFAULT_API_CONFIG } from '@/services/apiMainService/config';
import type { Customer, CustomerListParams, PaginatedResponse } from '@/pages/Customer/types/index';

const baseUrl = DEFAULT_API_CONFIG.baseURL.endsWith('/')
  ? `${DEFAULT_API_CONFIG.baseURL}customers`
  : `${DEFAULT_API_CONFIG.baseURL}/customers`;

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.company_id) {
        headers['X-Company-ID'] = userData.company_id;
      }
    } catch (e) {
      console.error('Erro ao parsear dados do usuário:', e);
    }
  }

  return headers;
};

export const customerService = {
  async list(params?: CustomerListParams): Promise<PaginatedResponse<Customer>> {
    console.log('Listando clientes com parâmetros:', params);
    try {
      const response = await axios.get(`${baseUrl}/`, {
        headers: getHeaders(),
        params,
      });
      console.log('Resposta da API (list):', response.data);

      // Validação para estrutura aninhada
      let results = response.data.results;
      if (response.data.results && typeof response.data.results === 'object' && Array.isArray(response.data.results.results)) {
        results = response.data.results.results;
      } else if (!Array.isArray(results)) {
        console.warn('Resposta da API não contém um array válido em "results":', response.data);
        results = [];
      }

      return {
        results,
        count: response.data.count || response.data.total || results.length,
        next: response.data.next || null,
        previous: response.data.previous || null,
      };
    } catch (error: any) {
      console.error('Erro ao listar clientes:', error.response?.data || error.message);
      throw error;
    }
  },

  async getById(id: number): Promise<Customer> {
    if (id === undefined || id === null || isNaN(id)) {
      throw new Error('ID do cliente inválido');
    }
    console.log('Buscando cliente com ID:', id);
    try {
      const response = await axios.get(`${baseUrl}/${id}/`, {
        headers: getHeaders(),
      });
      console.log('Resposta da API (getById):', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar cliente ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async create(data: Omit<Customer, 'customer_id' | 'created' | 'updated'>): Promise<Customer> {
    console.log('Criando novo cliente com dados:', data);
    try {
      const response = await axios.post(`${baseUrl}/`, data, {
        headers: getHeaders(),
      });
      console.log('Resposta da API (create):', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error.response?.data || error.message);
      throw error;
    }
  },

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    if (id === undefined || id === null || isNaN(id)) {
      throw new Error('ID do cliente inválido');
    }
    console.log('Atualizando cliente com ID:', id, 'Dados:', data);
    try {
      const response = await axios.put(`${baseUrl}/${id}/`, data, {
        headers: getHeaders(),
      });
      console.log('Resposta da API (update):', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao atualizar cliente ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async patch(id: number, data: Partial<Customer>): Promise<Customer> {
    if (id === undefined || id === null || isNaN(id)) {
      throw new Error('ID do cliente inválido');
    }
    console.log('Atualizando cliente parcialmente com ID:', id, 'Dados:', data);
    try {
      const response = await axios.patch(`${baseUrl}/${id}/`, data, {
        headers: getHeaders(),
      });
      console.log('Resposta da API (patch):', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao atualizar cliente parcialmente ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    if (id === undefined || id === null || isNaN(id)) {
      throw new Error('ID do cliente inválido');
    }
    console.log('Excluindo cliente com ID:', id);
    try {
      const response = await axios.delete(`${baseUrl}/${id}/`, {
        headers: getHeaders(),
      });
      console.log('Resposta da API (delete):', response.data);
      if (response.status !== 204 && !response.data) {
        throw new Error('Falha ao excluir cliente');
      }
    } catch (error: any) {
      console.error(`Erro ao excluir cliente ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async export(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    console.log('Iniciando exportação de clientes no formato:', format);
    try {
      const response = await axios.get(`${baseUrl}/export/`, {
        headers: {
          ...getHeaders(),
          'Accept': format === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv',
        },
        responseType: 'blob',
      });
      console.log('Resposta da API (export) - Tamanho do blob:', response.data.size);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao exportar clientes:', error.response?.data || error.message);
      throw error;
    }
  },

  async import(file: File, onProgress?: (percentage: number) => void): Promise<any> {
    console.log('Iniciando importação de arquivo:', file.name);
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
            console.log('Progresso da importação:', percentage, '%');
            onProgress(percentage);
          }
        },
      };

      const response = await axios.post(`${baseUrl}/import/`, formData, config);
      console.log('Resposta da API (import):', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao importar clientes:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default customerService;