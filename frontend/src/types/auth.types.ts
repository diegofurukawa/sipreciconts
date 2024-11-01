// src/types/auth.types.ts
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  is_staff: boolean;
  last_login?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}
