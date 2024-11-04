// src/types/auth.types.ts
export interface LoginCredentials {
    login: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      company_id: number;
      company_name?: string;
      role?: string;
      last_login?: string;
    };
    token: {
      access: string;
      refresh: string;
    };
  }
  
  export interface AuthContextType {
    user: LoginResponse['user'] | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
  }
  