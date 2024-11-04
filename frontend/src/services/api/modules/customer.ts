// src/services/api/modules/customer.ts
import { ApiService } from '../ApiService';
import type { 
  Customer, 
  CustomerCreateData, 
  CustomerUpdateData, 
  PaginatedResponse, 
  ApiResponse 
} from '../types';

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  document?: string;
  email?: string;
  customer_type?: string;
  enabled?: boolean;
  created_after?: string;
  created_before?: string;
}

export interface CustomerImportResponse extends ApiResponse {
  total_processed: number;
  success_count: number;
  error_count: number;
  errors?: Array<{
    row: number;
    message: string;
    data: Record<string, any>;
  }>;
}

export interface CustomerExportOptions {
  format?: 'csv' | 'xlsx';
  fields?: string[];
  include_disabled?: boolean;
  date_range?: {
    start: string;
    end: string;
  };
}

class CustomerApiService extends ApiService {
  private readonly baseUrl = '/customers';

  /**
   * Lista clientes com paginação e filtros
   */
  async list(params?: CustomerListParams): Promise<PaginatedResponse<Customer>> {
    return this.getPaginated<Customer>(this.baseUrl, {
      ...params,
      company_id: this.companyId
    });
  }

  /**
   * Busca cliente por ID
   */
  async getById(id: number): Promise<Customer> {
    return this.get<Customer>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria novo cliente
   */
  async create(data: CustomerCreateData): Promise<Customer> {
    return this.post<Customer>(this.baseUrl, data);
  }

  /**
   * Atualiza cliente existente
   */
  async update(id: number, data: CustomerUpdateData): Promise<Customer> {
    return this.put<Customer>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Atualiza campos específicos do cliente
   */
  async patch(id: number, data: Partial<CustomerUpdateData>): Promise<Customer> {
    return this.patch<Customer>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Exclui cliente (soft delete)
   */
  async delete(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Restaura cliente excluído
   */
  async restore(id: number): Promise<Customer> {
    return this.post<Customer>(`${this.baseUrl}/${id}/restore`);
  }

  /**
   * Exclusão permanente do cliente
   */
  async hardDelete(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${id}/permanent`);
  }

  /**
   * Exclusão em lote
   */
  async bulkDelete(ids: number[]): Promise<void> {
    await this.post(`${this.baseUrl}/bulk-delete`, { ids });
  }

  /**
   * Importa clientes de arquivo
   */
  async import(
    file: File, 
    options?: { 
      update_existing?: boolean;
      skip_errors?: boolean;
    },
    onProgress?: (percentage: number) => void
  ): Promise<CustomerImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    return this.uploadFile(
      `${this.baseUrl}/import`,
      file,
      onProgress,
      { params: options }
    );
  }

  /**
   * Exporta clientes para arquivo
   */
  async export(options?: CustomerExportOptions): Promise<Blob> {
    const response = await this.api.get(`${this.baseUrl}/export`, {
      params: options,
      responseType: 'blob',
      headers: {
        ...this.getHeaders(),
        Accept: options?.format === 'xlsx' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv'
      }
    });

    return response.data;
  }

  /**
   * Download do template de importação
   */
  async downloadTemplate(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await this.api.get(`${this.baseUrl}/import-template`, {
      params: { format },
      responseType: 'blob',
      headers: {
        ...this.getHeaders(),
        Accept: format === 'xlsx'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv'
      }
    });

    return response.data;
  }

  /**
   * Valida dados do cliente
   */
  async validate(data: Partial<CustomerCreateData>): Promise<{
    valid: boolean;
    errors?: Record<string, string[]>;
  }> {
    return this.post(`${this.baseUrl}/validate`, data);
  }

  /**
   * Verifica se documento já existe
   */
  async checkDocumentExists(document: string): Promise<{
    exists: boolean;
    customer_id?: number;
  }> {
    return this.get(`${this.baseUrl}/check-document`, { document });
  }

  /**
   * Busca clientes por termo
   */
  async search(term: string): Promise<Customer[]> {
    return this.get(`${this.baseUrl}/search`, { term });
  }

  /**
   * Lista clientes recentes
   */
  async recent(limit: number = 5): Promise<Customer[]> {
    return this.get(`${this.baseUrl}/recent`, { limit });
  }

  /**
   * Obtém estatísticas dos clientes
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    created_today: number;
    created_this_month: number;
  }> {
    return this.get(`${this.baseUrl}/stats`);
  }
}

// Exporta instância única do serviço
export const customerService = new CustomerApiService();

// Exporta classe para casos de uso específicos
export default CustomerApiService;