import axios from 'axios';
import { Customer } from '../types/customer';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

interface PaginatedResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Customer[];
    total_customers: number;
}

export const CustomerService = {
    list: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse> => {
        try {
            const response = await api.get<PaginatedResponse>('customers/', {
                params: {
                    page,
                    page_size: pageSize
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            throw error;
        }
    },

    create: async (data: Partial<Customer>): Promise<Customer> => {
        try {
            const response = await api.post<Customer>('customers/', data);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    },

    update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
        try {
            const response = await api.put<Customer>(`customers/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await api.delete(`customers/${id}/`);
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            throw error;
        }
    },



    import: async (file: File): Promise<{ success: boolean; message: string; errors?: any[] }> => {
        try {
            // Validar o arquivo
            if (!file.name.endsWith('.csv')) {
                throw new Error('O arquivo deve estar no formato CSV');
            }

            const formData = new FormData();
            formData.append('file', file);
            
            const response = await api.post<{
                success: boolean;
                message: string;
                errors?: Array<{
                    row: any;
                    error: string;
                }>;
            }>('customers/import_customers/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
            
        } catch (error: any) {
            // Melhor tratamento de erro com mensagens específicas
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao importar clientes';
            
            // Criar mensagem mais amigável para erros conhecidos
            if (errorMessage.includes('Cabeçalhos obrigatórios')) {
                throw new Error(`
                    O arquivo CSV deve conter os seguintes cabeçalhos:
                    - Nome
                    - Documento
                    - Tipo de Cliente
                    - Celular
                    - Email
                    - Endereço
                    - Complemento

                    Por favor, verifique se os nomes das colunas estão exatamente como especificado.
                `);
            }
            
            throw new Error(errorMessage);
        }
    },

    export: async (): Promise<void> => {
        try {
            const response = await api.get('customers/export/', {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/json',
                }
            });

            // Criar blob e URL
            const blob = new Blob([response.data], { 
                type: 'text/csv;charset=utf-8;' 
            });
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'clientes.csv');
            
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

        } catch (error: any) {
            console.error('Erro na exportação:', error);
            throw new Error(error.message || 'Erro ao exportar clientes');
        }
    }
};

export default api;