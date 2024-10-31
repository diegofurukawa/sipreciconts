// src/services/api/customer.ts
import { BaseApiService } from './base';
import { Customer, CustomerResponse, ImportResponse } from '../../types/customer';
import { APIError } from './types';
import axios, { AxiosError } from 'axios';

export class CustomerService extends BaseApiService {

  public readonly customers = {
    list: async (page: number = 1, filters?: Record<string, any>): Promise<CustomerResponse> => {
      this.checkAuth();
      try {
        const response = await this.api.get<CustomerResponse>('customers/', {
          params: {
            page,
            ...filters,
            company: this.getCompanyId()
          }
        });
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    create: async (data: Partial<Customer>): Promise<Customer> => {
      this.checkAuth();
      try {
        const response = await this.api.post<Customer>('customers/', {
          ...data,
          company: this.getCompanyId()
        });
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
      this.checkAuth();
      try {
        const response = await this.api.put<Customer>(`customers/${id}/`, {
          ...data,
          company: this.getCompanyId()
        });
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    delete: async (id: number): Promise<void> => {
      this.checkAuth();
      try {
        await this.api.delete(`customers/${id}/`, {
          params: { company: this.getCompanyId() }
        });
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    import: async (file: File): Promise<ImportResponse> => {
      this.checkAuth();
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('company', this.getCompanyId());
        
        const response = await this.api.post<ImportResponse>(
          'customers/import_customers/',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        return response.data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },

    export: async (filters?: Record<string, any>): Promise<void> => {
      this.checkAuth();
      try {
        const response = await this.api.get('customers/export/', {
          params: {
            ...filters,
            company: this.getCompanyId()
          },
          responseType: 'blob',
        });

        if (response.headers['content-type']?.includes('application/json')) {
          const text = await new Blob([response.data]).text();
          const error = JSON.parse(text);
          throw new APIError(
            error.detail || 'Erro ao exportar clientes',
            400,
            'EXPORT_ERROR'
          );
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        const filename = response.headers['content-disposition']
          ?.split('filename=')[1]
          ?.replace(/"/g, '') 
          || `clientes_${new Date().toISOString().split('T')[0]}.csv`;
        
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw this.handleError(error as AxiosError);
      }
    },
  };

}

// Exportando os tipos relacionados ao Customer
export type { Customer, CustomerResponse, ImportResponse };