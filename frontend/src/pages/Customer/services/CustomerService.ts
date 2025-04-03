// src/pages/Customer/services/CustomerService.ts
import axios from 'axios';
import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiPatch, 
  apiDelete, 
  apiExport,
  apiImport,
  apiDownloadTemplate
} from '@/services/apiMainService/apiClient';
import type { 
  Customer, 
  CustomerListParams, 
  PaginatedResponse, 
  CustomerImportResponse 
} from '@/pages/Customer/types';

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
      console.error('Erro ao parsear dados do usuário:', e);
    }
  }

  return headers;
};
  
// URL base para o serviço de clientes (sem a barra final)
const baseUrl = 'customers';

export const customerService = {
  async list(params?: CustomerListParams): Promise<PaginatedResponse<Customer>> {
    console.log('Listando clientes com parâmetros:', params);
    try {
      const data = await apiGet<any>(`${baseUrl}/`, { params });
      console.log('Resposta da API (list):', data);

      // Validação para estrutura aninhada
      let results = data.results;
      if (data.results && typeof data.results === 'object' && Array.isArray(data.results.results)) {
        results = data.results.results;
      } else if (!Array.isArray(results)) {
        console.warn('Resposta da API não contém um array válido em "results":', data);
        results = [];
      }

      return {
        results,
        count: data.count || data.total || results.length,
        next: data.next || null,
        previous: data.previous || null,
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
      return await apiGet<Customer>(`${baseUrl}/${id}/`);
    } catch (error: any) {
      console.error(`Erro ao buscar cliente ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async create(data: Omit<Customer, 'customer_id' | 'created' | 'updated'>): Promise<Customer> {
    console.log('Criando novo cliente com dados:', data);
    try {
      return await apiPost<Customer>(`${baseUrl}/`, data);
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
      return await apiPut<Customer>(`${baseUrl}/${id}/`, data);
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
      return await apiPatch<Customer>(`${baseUrl}/${id}/`, data);
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
      await apiDelete(`${baseUrl}/${id}/`);
    } catch (error: any) {
      console.error(`Erro ao excluir cliente ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async export(): Promise<void> {
    try {
      await apiExport(`${baseUrl}/export/`, 'clientes.xlsx');
    } catch (error: any) {
      console.error('Erro ao exportar clientes:', error);
      throw error;
    }
  },

  // Modificação para o método import em CustomerService.ts
  // Método import em CustomerService.ts seguindo a lógica antiga que funcionava
  async import(file: File, options = {}, onProgress?: (percentage: number) => void): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Adicionar opções como parâmetros separados
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

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

      // Usando o endpoint correto
      const url = `${baseUrl}/import_customers/`;
      const response = await axios.post(url, formData, config);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao importar clientes:', error.response?.data || error.message);
      throw error;
    }
  },

  async restore(id: number): Promise<Customer> {
    if (id === undefined || id === null || isNaN(id)) {
      throw new Error('ID do cliente inválido');
    }
    console.log('Restaurando cliente com ID:', id);
    try {
      return await apiPost<Customer>(`${baseUrl}/${id}/restore/`, {});
    } catch (error: any) {
      console.error(`Erro ao restaurar cliente ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async hardDelete(id: number): Promise<void> {
    if (id === undefined || id === null || isNaN(id)) {
      throw new Error('ID do cliente inválido');
    }
    console.log('Excluindo permanentemente cliente com ID:', id);
    try {
      await apiDelete(`${baseUrl}/${id}/hard-delete/`);
    } catch (error: any) {
      console.error(`Erro ao excluir permanentemente cliente ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async validate(data: Partial<Customer>): Promise<{
    valid: boolean;
    errors?: Record<string, string[]>;
  }> {
    try {
      return await apiPost<{
        valid: boolean;
        errors?: Record<string, string[]>;
      }>(`${baseUrl}/validate/`, data);
    } catch (error: any) {
      console.error('Erro ao validar dados do cliente:', error);
      throw error;
    }
  },

  async checkDocumentExists(document: string): Promise<{ exists: boolean }> {
    try {
      return await apiGet<{ exists: boolean }>(`${baseUrl}/check-document/`, {
        params: { document }
      });
    } catch (error: any) {
      console.error('Erro ao verificar documento:', error);
      throw error;
    }
  },

  async downloadTemplate(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      return await apiDownloadTemplate(`${baseUrl}/template/`, format);
    } catch (error: any) {
      console.error('Erro ao baixar modelo:', error);
      throw error;
    }
  }
};

export default customerService;