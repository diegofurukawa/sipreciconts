// src/services/supplyService.ts
import api from './api';
import { Supply } from '../types/supply';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Supply[];
}

export const SupplyService = {
    list: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse> => {
        try {
            const response = await api.get<PaginatedResponse>('supplies/', {
                params: {
                    page,
                    page_size: pageSize
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao listar insumos:', error);
            throw error;
        }
    },

    create: async (data: Partial<Supply>): Promise<Supply> => {
        try {
            const response = await api.post<Supply>('supplies/', data);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar insumo:', error);
            throw error;
        }
    },

    update: async (id: number, data: Partial<Supply>): Promise<Supply> => {
        try {
            const response = await api.put<Supply>(`supplies/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar insumo:', error);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await api.delete(`supplies/${id}/`);
        } catch (error) {
            console.error('Erro ao excluir insumo:', error);
            throw error;
        }
    },

    import: async (file: File): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            await api.post('supplies/import_supplies/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.error('Erro ao importar insumos:', error);
            throw error;
        }
    },

    export: async (): Promise<void> => {
        try {
            const response = await api.get('supplies/export/', {
                responseType: 'blob',
            });
            
            // Criar o objeto URL para o blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            
            // Obter o nome do arquivo do header Content-Disposition, se disponível
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'insumos.csv';
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }
            
            // Criar um link temporário e clicar nele para download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            
            // Limpar
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao exportar insumos:', error);
            throw error;
        }
    },

    getById: async (id: number): Promise<Supply> => {
        try {
            const response = await api.get<Supply>(`supplies/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar insumo:', error);
            throw error;
        }
    },

    search: async (query: string, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse> => {
        try {
            const response = await api.get<PaginatedResponse>('supplies/', {
                params: {
                    search: query,
                    page,
                    page_size: pageSize
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao pesquisar insumos:', error);
            throw error;
        }
    },

    bulkDelete: async (ids: number[]): Promise<void> => {
        try {
            await api.post('supplies/bulk_delete/', { ids });
        } catch (error) {
            console.error('Erro ao excluir insumos em massa:', error);
            throw error;
        }
    }
};

export default SupplyService;