export interface CompanyFormData {
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Company extends CompanyFormData {
  company_id: string;
  company: string;
  // name: string;
  // document?: string;
  // phone?: string;
  // email?: string;
  // address?: string;
  enabled: boolean;
  created?: string;
  updated?: string;
}

export type CompanyActionType = 'create' | 'edit' | 'delete' | 'view';
  