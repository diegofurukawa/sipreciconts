// src/services/api/customer.ts
import { api } from './base';
import type { Customer } from '@/pages/Customer/types';

const CUSTOMER_ENDPOINT = '/customers';

export const CustomerService = {
  list: async (): Promise<Customer[]> => {
    const response = await api.get(CUSTOMER_ENDPOINT);
    return response.data;
  },

  create: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await api.post(CUSTOMER_ENDPOINT, data);
    return response.data;
  },

  update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
    const response = await api.put(`${CUSTOMER_ENDPOINT}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${CUSTOMER_ENDPOINT}/${id}`);
  },

  import: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`${CUSTOMER_ENDPOINT}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  export: async (): Promise<void> => {
    const response = await api.get(`${CUSTOMER_ENDPOINT}/export`, {
      responseType: 'blob',
    });
    
    // Criar blob e fazer download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Pegar nome do arquivo do header ou usar padrão
    const contentDisposition = response.headers['content-disposition'];
    const fileName = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'clientes.csv';
    
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};