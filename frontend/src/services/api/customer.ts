import {api} from './base';
import { handleApiError } from './utils';
import { PaginatedResponse } from './types';

export interface Customer {
  id?: number;
  name: string;
  document?: string;
  customer_type?: string;
  celphone: string;
  email?: string;
  address?: string;
  complement?: string;
  enabled?: boolean;
  created?: string;
  updated?: string;
}

const CustomerService = {
  /**
   * Lista todos os clientes
   */
  list: async (): Promise<PaginatedResponse<Customer>> => {
    try {
      const response = await api.get<PaginatedResponse<Customer>>('/customers/');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Cria um novo cliente
   */
  create: async (data: Partial<Customer>): Promise<Customer> => {
    try {
      const response = await api.post<Customer>('/customers/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Atualiza um cliente existente
   */
  update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
    try {
      const response = await api.put<Customer>(`/customers/${id}/`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Remove um cliente
   */
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/customers/${id}/`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Importa clientes de um arquivo
   */
  import: async (file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/customers/import_customers/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Exporta clientes para CSV
   */
  export: async (): Promise<void> => {
    try {
      const response = await api.get('/customers/export/', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clientes_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Busca um cliente específico
   */
  getById: async (id: number): Promise<Customer> => {
    try {
      const response = await api.get<Customer>(`/customers/${id}/`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};


export {
  CustomerService
}