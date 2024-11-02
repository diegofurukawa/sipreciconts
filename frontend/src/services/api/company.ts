// src/services/api/company.ts
import { api } from './base';
import type { Company } from '../../types/company';
import { handleApiError } from './utils';

export const CompanyService = {
  list: async (): Promise<Company[]> => {
    try {
      const response = await api.get<Company[]>('companies/');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (data: Partial<Company>): Promise<Company> => {
    try {
      const response = await api.post<Company>('companies/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (id: number, data: Partial<Company>): Promise<Company> => {
    try {
      const response = await api.put<Company>(`companies/${id}/`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`companies/${id}/`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};