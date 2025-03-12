// src/pages/Supply/services/SupplyService.ts
import axios from 'axios';
import { DEFAULT_API_CONFIG } from '@/services/apiMainService/config';
import type { PaginatedResponse } from '@/types/api_types';
import type { Supply, SupplyListParams } from '@/pages/Supply/types';
import { extractErrorMessages } from '../utils';

// URL base para o serviço de insumos
const baseUrl = DEFAULT_API_CONFIG.baseURL.endsWith('/')
  ? `${DEFAULT_API_CONFIG.baseURL}supplies`
  : `${DEFAULT_API_CONFIG.baseURL}/supplies`;

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

// Serviço de insumos baseado em objeto literal
export const SupplyService = {
  /**
   * Lista todos os insumos cadastrados
   */
  async list(page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Supply>> {
    console.log('Carregando insumos com parâmetros:', { page, limit, search });
    try {
      const response = await axios.get(`${baseUrl}/`, {
        headers: getHeaders(),
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar insumos:', error);
      throw error;
    }
  },

  /**
   * Busca um insumo específico pelo ID
   */
  async getById(id: number): Promise<Supply> {
    try {
      const response = await axios.get(`${baseUrl}/${id}/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar insumo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca insumos por termo de pesquisa
   */
  async search(term: string): Promise<PaginatedResponse<Supply>> {
    try {
      const response = await axios.get(`${baseUrl}/`, {
        headers: getHeaders(),
        params: { search: term },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao pesquisar insumos:', error);
      throw error;
    }
  },

  /**
   * Cria um novo insumo
   */
  async create(data: Omit<Supply, 'id' | 'created' | 'updated'>): Promise<Supply> {
    try {
      const response = await axios.post(`${baseUrl}/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar insumo:', error);
      throw error;
    }
  },

  /**
   * Atualiza um insumo existente
   */
  async update(id: number, data: Partial<Supply>): Promise<Supply> {
    try {
      console.log(`Atualizando insumo com ID: ${id}`, data);
      const response = await axios.put(`${baseUrl}/${id}/`, data, {
        headers: getHeaders(),
      });
      console.log('Resposta da API:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao atualizar insumo ${id}:`, error);
      
      // Extrair mensagem de erro mais específica
      const errorMessage = extractErrorMessages(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Remove um insumo
   */
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${baseUrl}/${id}/`, {
        headers: getHeaders(),
      });
    } catch (error) {
      console.error(`Erro ao excluir insumo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exporta insumos
   */
  async export(): Promise<void> {
    try {
      // Endpoint correto para exportação
      const url = `${baseUrl}/export/`;
      
      const response = await axios.get(url, {
        headers: getHeaders(), // Apenas os headers padrão que incluem a autenticação
        responseType: 'blob', // Importante para receber o arquivo corretamente
      });
      
      // Inicia o download do arquivo
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'insumos.csv';
      
      // Tenta extrair o nome do arquivo do header Content-Disposition, se disponível
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      const downloadUrl = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error: any) {
      console.error('Erro ao exportar insumos:', error);
      throw error;
    }
  },

  /**
   * Importa insumos a partir de um arquivo
   */
  async import(file: File, options = {}, onProgress?: (percentage: number) => void): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Adicionar opções como parâmetros separados
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

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

      // Usando o endpoint correto
      const url = `${baseUrl}/import_supplies/`;
      const response = await axios.post(url, formData, config);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao importar insumos:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default SupplyService;