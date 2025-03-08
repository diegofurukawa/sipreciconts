// src/pages/Company/types/company_types.ts
export interface Company {
  company_id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  enabled: boolean;
  administrators_count?: number; // Opcional, conforme a API
  employees_count?: number; // Opcional, conforme a API
}

export interface CompanyFormData extends Company {
  address?: string; // Adicionado para o formulário, se necessário
}

export interface UseCompanyListReturn {
  companies: Company[];
  loading: boolean;
  error: string | null;
  deleteLoading: number | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    nextPage: string | null;
    previousPage: string | null;
  };
  searchTerm: string;
  pageId: string;
  handleDelete: (id: number) => Promise<void>;
  handleEdit: (id: number) => void;
  handleNew: () => void;
  handleView: (id: number) => void;
  handlePageChange: (page: number) => void;
  handleSearch: (term: string) => Promise<void>;
  handleImport: () => Promise<void>;
  handleExport: () => Promise<void>;
  refresh: () => void;
  retry: () => void;
  isDeleting: (id: number) => boolean;
  isEmpty: boolean;
  hasError: boolean;
}

export interface UseCompanyFormReturn {
  companyData: CompanyFormData;
  isLoading: boolean;
  isSubmitting: boolean;
  isEditMode: boolean;
  onSubmit: (data: CompanyFormData) => Promise<void>;
}

export const INITIAL_COMPANY_FORM_DATA: CompanyFormData = {
  company_id: '',
  name: '',
  document: '',
  email: '',
  phone: '',
  enabled: true,
  address: '',
};