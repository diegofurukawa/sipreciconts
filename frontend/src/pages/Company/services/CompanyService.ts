// src/pages/Company/services/CompanyService.ts
import axios from 'axios';
import { DEFAULT_API_CONFIG } from '@/services/apiMainService/config';
import type { PaginatedResponse } from '@/types/api_types';
import type { Company, CompanyListParams } from '@/pages/Company/types/CompanyTypes';

// URL base para o serviço de empresas
const baseUrl = DEFAULT_API_CONFIG.baseURL.endsWith('/')
  ? `${DEFAULT_API_CONFIG.baseURL}companies` 
  : `${DEFAULT_API_CONFIG.baseURL}/companies`;

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
      console.error('Erro ao recuperar dados do usuário:', e);
    }
  }

  return headers;
};

// Serviço de empresas baseado em objeto literal
export const companyService = {
  /**
   * Lista todas as empresas cadastradas
   */
  async list(params?: CompanyListParams): Promise<PaginatedResponse<Company>> {
    console.log('Carregando empresas com parâmetros:', params);
    try {
      const response = await axios.get(`${baseUrl}/`, {
        headers: getHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar empresas:', error);
      throw error;
    }
  },

  /**
   * Busca uma empresa específica pelo ID
   * Aceita ID como string (CO001) ou número
   */
  async getById(id: string | number): Promise<Company> {
    if (id === undefined || id === null || id === '') {
      throw new Error('ID da empresa inválido');
    }
    try {
      const response = await axios.get(`${baseUrl}/${id}/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar empresa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria uma nova empresa
   */
  async create(data: Omit<Company, 'company_id' | 'created' | 'updated'>): Promise<Company> {
    try {
      const response = await axios.post(`${baseUrl}/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma empresa existente
   * Aceita ID como string (CO001) ou número
   */
  async update(id: string | number, data: Partial<Company>): Promise<Company> {
    if (id === undefined || id === null || id === '') {
      throw new Error('ID da empresa inválido');
    }
    try {
      const response = await axios.put(`${baseUrl}/${id}/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar empresa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Remove uma empresa (soft delete)
   * Aceita ID como string (CO001) ou número
   */
  async delete(id: string | number): Promise<void> {
    if (id === undefined || id === null || id === '') {
      throw new Error('ID da empresa inválido');
    }
    try {
      await axios.delete(`${baseUrl}/${id}/`, {
        headers: getHeaders(),
      });
    } catch (error) {
      console.error(`Erro ao excluir empresa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exporta empresas
   */
  async export(format: 'csv' | 'xlsx' = 'xlsx'): Promise<Blob> {
    try {
      const response = await axios.get(`${baseUrl}/export`, {
        headers: {
          ...getHeaders(),
          'Accept': format === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv',
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar empresas:', error);
      throw error;
    }
  },

  /**
   * Importa empresas a partir de um arquivo
   */
  async import(file: File, onProgress?: (percentage: number) => void): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

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

      const response = await axios.post(`${baseUrl}/import`, formData, config);
      return response.data;
    } catch (error) {
      console.error('Erro ao importar empresas:', error);
      throw error;
    }
  },
};

// Exportar como default para compatibilidade
export default companyService;