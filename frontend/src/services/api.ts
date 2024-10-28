import axios from 'axios';
import { Customer, CustomerResponse, ImportResponse } from '../types/customer';
import { Tax } from '../types/tax';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export const CustomerService = {
  list: async (page: number = 1): Promise<CustomerResponse> => {
    const response = await api.get<CustomerResponse>(`customers/?page=${page}`);
    return response.data;
  },

  create: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await api.post<Customer>('customers/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
    const response = await api.put<Customer>(`customers/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`customers/${id}/`);
  },

  import: async (file: File): Promise<ImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<ImportResponse>('customers/import_customers/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  export: async (): Promise<void> => {
    const response = await api.get('customers/export/', {
      responseType: 'blob',
    });
    
    // Criar blob URL e fazer download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};

// ===============================================================
  // Tax = Impostos
// ===============================================================

// Adicione junto com os outros serviços
// import axios from 'axios';
// import { Tax } from '../types/tax';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api/',
// });

export const TaxService = {
  list: async (page = 1): Promise<{ results: Tax[]; count: number }> => {
    const response = await api.get<{ results: Tax[]; count: number }>('taxes/', {
      params: { page, page_size: 10 }
    });
    return response.data;
  },

  create: async (data: Partial<Tax>): Promise<Tax> => {
    const response = await api.post<Tax>('taxes/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Tax>): Promise<Tax> => {
    const response = await api.put<Tax>(`taxes/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`taxes/${id}/`);
  }
};

export default api;