export interface Customer {
  id?: number;
  name: string;
  document?: string;
  customer_type?: string;
  celphone: string;
  email?: string;
  address?: string;
  complement?: string;
  enabled?: boolean;
  created?: string;
  updated?: string;
  company_id: string; // Added company field
}
  
  export interface CustomerResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Customer[];
  }
  
  export interface ImportResponse {
    success: boolean;
    message: string;
    errors?: Array<{
      row: any;
      error: string;
    }>;
  }