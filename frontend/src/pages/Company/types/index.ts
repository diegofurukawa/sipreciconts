// src/pages/Company/types/index.ts
export interface CompanyFormData {
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Company extends CompanyFormData {
  id: number;
  created_at: string;
  updated_at: string;
  enabled: boolean;
}

export type CompanyActionType = 'create' | 'edit' | 'delete' | 'view';
  