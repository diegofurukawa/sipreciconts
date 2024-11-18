// src/types/company.ts
export interface Company {
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