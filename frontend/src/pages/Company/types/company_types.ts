// src/pages/Company/types/index.ts
export interface Company {
    id?: number;
    company_id: string;
    name: string;
    document?: string;
    phone?: string;
    email?: string;
    address?: string;
    enabled: boolean;
    created?: string;
    updated?: string;
  }
  
  export type CompanyFormData = Omit<Company, 'id' | 'created' | 'updated'>;
  
  export const INITIAL_COMPANY_FORM_DATA: CompanyFormData = {
    company_id: '',
    name: '',
    document: '',
    phone: '',
    email: '',
    address: '',
    enabled: true
  };

// Interface para resposta da API paginada
export interface PaginatedResponse {
count: number;
next: string | null;
previous: string | null;
results: Company[];
total_count?: number;
}

export interface UseCompanyListProps {
initialData?: Company[];
}


export interface UseCompanyFormReturn {
  companyData: CompanyFormData;
  isLoading: boolean;
  isSubmitting: boolean;
  isEditMode: boolean;
  onSubmit: (data: CompanyFormData) => Promise<void>;
}


// // Definição da interface Company
// export interface Company {
//   id: number;
//   name: string;
//   document?: string;
//   email?: string;
//   phone?: string;
//   enabled?: boolean;
//   created?: string;
//   updated?: string;
//   company_id?: string;
// }

// // Interface para resposta da API paginada
// interface PaginatedResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: Company[];
//   total_count?: number;
// }

// interface UseCompanyListProps {
//   initialData?: Company[];
// }