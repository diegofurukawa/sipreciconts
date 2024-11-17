// src/pages/Login/types/index.ts

// Tipos atualizados
export interface LoginFormData {
  login: string;    // Mantido como username para compatibilidade com backend
  password: string;
}

export interface LoginFormErrors {
  login?: string;   // Mantido como username para compatibilidade com backend
  password?: string;
}

export interface UseLoginFormReturn {
  formData: LoginFormData;
  errors: LoginFormErrors;
  isSubmitting: boolean;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

// Tipos para resposta da API
export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    login: string;
    user_name: string;
    email: string;
    type: string;
    company_id: string;
    company_name?: string;
    enabled: boolean;
    last_login?: string;
  };
  session_id: string;
  expires_in: number;
}