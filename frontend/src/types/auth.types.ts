// src/types/auth.types.ts

export interface AuthUser {
  id: number;
  login: string;
  user_name: string;
  name: string;
  email: string;
  type: string;
  company_id: string;
  company_name?: string;
  last_login?: string;
}

export interface AuthCredentials {
  login: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  access: string;
  refresh: string;
  session_id: string;
  expires_in: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  company_id?: string;
  loading: boolean;
  session_id?: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface User {
  id: number;
  login: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  is_staff: boolean;
  last_login?: string;
}

export interface LoginResponse {
  access: string;      // Token JWT de acesso
  refresh: string;     // Token JWT de refresh
  user: User;          // Dados do usuário
}

// Interface para o token decodificado
export interface DecodedToken {
  exp: number;         // Timestamp de expiração
  iat: number;         // Timestamp de emissão
  jti: string;         // JWT ID
  token_type: string;  // Tipo do token (access/refresh)
  user_id: number;     // ID do usuário
}

// Interface para respostas de refresh de token
export interface RefreshTokenResponse {
  access: string;
}



// src/types/auth.types.ts
export interface LoginCredentials {
  login: string;
  password: string;
}

// export interface LoginResponse {
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     login: string;
//     company_id: number;
//     company_name?: string;
//     role?: string;
//     last_login?: string;
//   };
//   token: {
//     access: string;
//     refresh: string;
//   };
// }

// // Interface para respostas de refresh de token
// export interface AuthContextType {
//   user: User;
//   login: string;
//   token: string;
// }

interface AuthContextType {
  user: LoginResponse['user'] | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export type {
AuthContextType
};