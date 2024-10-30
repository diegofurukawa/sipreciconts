// src/services/api.ts
import axios from 'axios';
import { Customer, CustomerResponse, ImportResponse } from '../types/customer';
import { Tax } from '../types/tax';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@App:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@App:token');
      localStorage.removeItem('@App:user');
      localStorage.removeItem('@App:company_id');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

export const AuthService = {
  login: async (login: string, password: string) => {
    const response = await api.post('/auth/login/', { login, password });
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } finally {
      localStorage.removeItem('@App:token');
      localStorage.removeItem('@App:user');
      localStorage.removeItem('@App:company_id');
    }
  }
};

export default api;