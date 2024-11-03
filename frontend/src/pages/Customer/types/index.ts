// src/pages/Customer/types/index.ts
export interface Customer {
    customer_id?: number;
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
  }
  
  export interface CustomerFormData extends Omit<Customer, 'customer_id' | 'enabled' | 'created' | 'updated'> {}