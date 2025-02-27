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