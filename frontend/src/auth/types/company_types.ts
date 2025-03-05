// src/auth/types/company_types.ts
export interface Company {
    company_id: string;
    name: string;
    document?: string;
    company_type?: string;
    phone?: string;
    celphone?: string;
    email?: string;
    address?: string;
    complement?: string;
    enabled?: boolean;
    created?: string;
    updated?: string;
  }
  
  export interface CompanyState {
    currentCompany: Company | null;
    availableCompanies: Company[];
    loading: boolean;
    error: string | null;
  }
  
  export type CompanyAction =
    | { type: 'SET_CURRENT_COMPANY'; payload: Company }
    | { type: 'SET_AVAILABLE_COMPANIES'; payload: Company[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'RESET_COMPANY_STATE' };
  
  export interface CompanyContextType {
    state: CompanyState;
    dispatch: React.Dispatch<CompanyAction>;
  }
  
  export interface CompanyListParams {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    enabled?: boolean;
  }
  
  export interface PaginatedCompanyResponse {
    results: Company[];
    count: number;
    next: string | null;
    previous: string | null;
    current_page?: number;
    total_pages?: number;
  }