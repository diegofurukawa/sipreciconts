// src/services/api/customer.ts
import { api } from './base';
import type { Customer } from '@/types/customer';

interface ListParams {
  company_id?: number;
}

export const CustomerService = {
  list: async (params?: ListParams) => {
    const response = await api.get<Customer[]>('/api/customers/', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Customer>(`/api/customers/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Customer>) => {
    const response = await api.post<Customer>('/api/customers/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Customer>) => {
    const response = await api.put<Customer>(`/api/customers/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/api/customers/${id}/`);
  },

  import: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/customers/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  export: async () => {
    const response = await api.get('/api/customers/export/', {
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
  }
};