// src/pages/Customer/services/CustomerService.ts
import axios from 'axios';
import { DEFAULT_API_CONFIG } from '@/services/apiMainService/config';
import type { PaginatedResponse } from '@/types/api_types';
import type { Customer, CustomerListParams } from '@/pages/Customer/types';

// URL base para o serviço de clientes
const baseUrl = DEFAULT_API_CONFIG.baseURL.endsWith('/')
  ? `${DEFAULT_API_CONFIG.baseURL}customers`
  : `${DEFAULT_API_CONFIG.baseURL}/customers`;

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

  // Método export no CustomerService.ts
  async export(): Promise<void> {
    try {
      // Endpoint correto para exportação
      const url = `${baseUrl}/export/`;
      
      const response = await axios.get(url, {
        headers: getHeaders(), // Apenas os headers padrão que incluem a autenticação
        responseType: 'blob', // Importante para receber o arquivo corretamente
      });
      
      // Inicia o download do arquivo
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'clientes.xlsx';
      
      // Tenta extrair o nome do arquivo do header Content-Disposition, se disponível
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      const downloadUrl = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error: any) {
      console.error('Erro ao exportar clientes:', error);
      throw error;
    }
  },

  // Método import corrigido no CustomerService.ts
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

  // Métodos adicionais para o CustomerDetails
  async restore(id: number): Promise<Customer> {
    if (id === undefined || id === null || isNaN(id)) {
      throw new Error('ID do cliente inválido');
    }
    console.log('Restaurando cliente com ID:', id);
    try {
      const response = await axios.post(`${baseUrl}/${id}/restore/`, {}, {
        headers: getHeaders(),
      });
      console.log('Resposta da API (restore):', response.data);
      return response.data;
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
      const response = await axios.delete(`${baseUrl}/${id}/hard-delete/`, {
        headers: getHeaders(),
      });
      console.log('Resposta da API (hardDelete):', response.data);
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
      const response = await axios.post(`${baseUrl}/validate/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao validar dados do cliente:', error);
      throw error;
    }
  },

  async checkDocumentExists(document: string): Promise<{ exists: boolean }> {
    try {
      const response = await axios.get(`${baseUrl}/check-document/`, {
        headers: getHeaders(),
        params: { document },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao verificar documento:', error);
      throw error;
    }
  },

  async downloadTemplate(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      const response = await axios.get(`${baseUrl}/template/`, {
        headers: {
          ...getHeaders(),
          'Accept': format === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv',
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao baixar modelo:', error);
      throw error;
    }
  }
};

export default customerService;