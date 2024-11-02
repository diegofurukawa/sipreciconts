// src/pages/Login/types/index.ts
export interface LoginFormData {
    username: string;
    password: string;
  }
  
  export interface LoginFormErrors {
    username?: string;
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
  