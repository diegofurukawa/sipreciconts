// src/services/api/customer.ts
import { api, handleApiError } from './utils';
import { PaginatedResponse } from './types';
import { Customer } from '../../types/customer';

export const CustomerService = {
  list: async (): Promise<Customer[]> => {
    try {
      const response = await api.get<PaginatedResponse<Customer>>('/customers/');
      return response.data.results;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (data: Partial<Customer>): Promise<Customer> => {
    try {
      const response = await api.post<Customer>('/customers/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
    try {
      const response = await api.put<Customer>(`/customers/${id}/`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/customers/${id}/`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

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

  export: async (): Promise<void> => {
    try {
      const response = await api.get('/customers/export/', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'clientes.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Adicionar uma exportação default para maior flexibilidade
export default CustomerService;