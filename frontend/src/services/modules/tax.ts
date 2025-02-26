// src/services/api/modules/TaxApiService.ts
import axios from 'axios';

// Constantes
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Tipos
export interface company {
  company_id: number;
  name: string;
  document?: string;
  company_type?: string;
  celphone: string;
  email?: string;
  address?: string;
  complement?: string;
  enabled?: boolean;
  created?: string;
  updated?: string;
}

export interface companyListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
  current_page?: number;
  total_pages?: number;
  total?: number;
}

// Classe do serviço
class TaxApiService {
  private token: string | null = null;
  private companyId: number | null = null;

  constructor() {
    // Tentar recuperar o token do localStorage ao inicializar
    this.token = localStorage.getItem('token');
    
    // Tentar recuperar o ID da empresa
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.companyId = userData.company_id;
      } catch (e) {
        console.error('Erro ao recuperar dados do usuário:', e);
      }
    }
  }

  // Headers para requisições
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.companyId) {
      headers['X-Company-ID'] = this.companyId.toString();
    }

    return headers;
  }

  // Métodos de API
  async list(params?: companyListParams): Promise<PaginatedResponse<company>> {
    try {
      const url = `${API_BASE_URL}/companys/`;
      const response = await axios.get(url, {
        headers: this.getHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<company> {
    try {
      const url = `${API_BASE_URL}/companys/${id}/`;
      const response = await axios.get(url, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar cliente ${id}:`, error);
      throw error;
    }
  }

  async create(data: Omit<company, 'company_id'>): Promise<company> {
    try {
      const url = `${API_BASE_URL}/companys/`;
      const response = await axios.post(url, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<company>): Promise<company> {
    try {
      const url = `${API_BASE_URL}/companys/${id}/`;
      const response = await axios.put(url, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cliente ${id}:`, error);
      throw error;
    }
  }

  async patch(id: number, data: Partial<company>): Promise<company> {
    try {
      const url = `${API_BASE_URL}/companys/${id}/`;
      const response = await axios.patch(url, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cliente parcialmente ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const url = `${API_BASE_URL}/companys/${id}/`;
      await axios.delete(url, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error(`Erro ao excluir cliente ${id}:`, error);
      throw error;
    }
  }

  async export(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      const url = `${API_BASE_URL}/companys/export/`;
      const response = await axios.get(url, {
        headers: {
          ...this.getHeaders(),
          'Accept': format === 'xlsx' 
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv'
        },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar clientes:', error);
      throw error;
    }
  }

  async import(file: File, onProgress?: (percentage: number) => void): Promise<any> {
    try {
      const url = `${API_BASE_URL}/companys/import/`;
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(url, formData, {
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentage);
          }
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao importar clientes:', error);
      throw error;
    }
  }

  // Controle de autenticação e empresa
  setToken(token: string): void {
    this.token = token;
  }

  setCompanyId(id: number): void {
    this.companyId = id;
  }
}

// Exporta instância única do serviço
export const taxService = new TaxApiService();

// Exporta classe para casos de uso específicos
export default TaxApiService;