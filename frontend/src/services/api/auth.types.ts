// src/types/auth.types.ts
export interface LoginCredentials {
    login: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      user_id: number;
      login: string;
      name: string;
      company_id: string;
    };
  }
  
  export interface AuthContextType {
    user: LoginResponse['user'] | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
  }
  