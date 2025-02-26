// src/services/api/modules/company.ts
import { ApiService } from '../ApiService';
import type { 
  Company,
  CompanyCreateData,
  CompanyUpdateData,
  PaginatedResponse,
  ApiResponse 
} from '../../../types/api.types';

export interface CompanyListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  document?: string;
  type?: string;
  status?: 'active' | 'inactive' | 'pending';
  created_after?: string;
  created_before?: string;
}

export interface CompanySettings {
  fiscal_data?: {
    tax_regime?: string;
    tax_id?: string;
    state_registration?: string;
    municipal_registration?: string;
  };
  notification_settings?: {
    email_notifications?: boolean;
    contract_alerts?: boolean;
    payment_reminders?: boolean;
    report_frequency?: 'daily' | 'weekly' | 'monthly';
  };
  contract_settings?: {
    default_payment_terms?: number;
    default_contract_duration?: number;
    auto_renewal?: boolean;
    require_approval?: boolean;
  };
  system_settings?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    timezone?: string;
    date_format?: string;
    currency?: string;
  };
}

export interface CompanyLogo {
  url: string;
  thumbnail_url: string;
  filename: string;
  size: number;
}

class CompanyApiService extends ApiService {
  private readonly baseUrl = '/companies';

  /**
   * Lista empresas com paginação e filtros
   */
  async list(params?: CompanyListParams): Promise<PaginatedResponse<Company>> {
    return this.getPaginated<Company>(this.baseUrl, params);
  }

  /**
   * Busca empresa por ID
   */
  async getById(id: number): Promise<Company> {
    return this.get<Company>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtém empresa atual do usuário
   */
  async getCurrent(): Promise<Company> {
    return this.get<Company>(`${this.baseUrl}/current`);
  }

  /**
   * Cria nova empresa
   */
  async create(data: CompanyCreateData): Promise<Company> {
    return this.post<Company>(this.baseUrl, data);
  }

  /**
   * Atualiza empresa existente
   */
  async update(id: number, data: CompanyUpdateData): Promise<Company> {
    return this.put<Company>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Atualiza campos específicos da empresa
   */
  async patch(id: number, data: Partial<CompanyUpdateData>): Promise<Company> {
    return this.patch<Company>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Exclui empresa (soft delete)
   */
  async delete(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Restaura empresa excluída
   */
  async restore(id: number): Promise<Company> {
    return this.post<Company>(`${this.baseUrl}/${id}/restore`);
  }

  /**
   * Upload de logo da empresa
   */
  async uploadLogo(
    id: number, 
    file: File,
    onProgress?: (percentage: number) => void
  ): Promise<CompanyLogo> {
    return this.uploadFile(
      `${this.baseUrl}/${id}/logo`,
      file,
      onProgress
    );
  }

  /**
   * Remove logo da empresa
   */
  async removeLogo(id: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${id}/logo`);
  }

  /**
   * Obtém configurações da empresa
   */
  async getSettings(id: number): Promise<CompanySettings> {
    return this.get<CompanySettings>(`${this.baseUrl}/${id}/settings`);
  }

  /**
   * Atualiza configurações da empresa
   */
  async updateSettings(
    id: number, 
    settings: Partial<CompanySettings>
  ): Promise<CompanySettings> {
    return this.put<CompanySettings>(`${this.baseUrl}/${id}/settings`, settings);
  }

  /**
   * Troca empresa atual do usuário
   */
  async switchCompany(id: number): Promise<{
    success: boolean;
    token?: string;
    company: Company;
  }> {
    return this.post(`${this.baseUrl}/switch`, { company_id: id });
  }

  /**
   * Valida dados da empresa
   */
  async validate(data: Partial<CompanyCreateData>): Promise<{
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
    company_id?: number;
  }> {
    return this.get(`${this.baseUrl}/check-document`, { document });
  }

  /**
   * Obtém estatísticas da empresa
   */
  async getStats(id: number): Promise<{
    customer_count: number;
    active_contracts: number;
    total_revenue: number;
    active_users: number;
    storage_used: number;
  }> {
    return this.get(`${this.baseUrl}/${id}/stats`);
  }

  /**
   * Obtém limites e uso da empresa
   */
  async getUsageLimits(id: number): Promise<{
    storage: {
      used: number;
      limit: number;
      percentage: number;
    };
    users: {
      active: number;
      limit: number;
      percentage: number;
    };
    customers: {
      count: number;
      limit: number;
      percentage: number;
    };
  }> {
    return this.get(`${this.baseUrl}/${id}/usage-limits`);
  }

  /**
   * Busca empresas por termo
   */
  async search(term: string): Promise<Company[]> {
    return this.get(`${this.baseUrl}/search`, { term });
  }

  /**
   * Lista empresas acessíveis pelo usuário
   */
  async listAccessible(): Promise<Company[]> {
    return this.get(`${this.baseUrl}/accessible`);
  }
}

// Exporta instância única do serviço
export const companyService = new CompanyApiService();

// Exporta classe para casos de uso específicos
export default CompanyApiService;