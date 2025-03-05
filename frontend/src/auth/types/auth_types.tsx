// src/auth/types/auth_types.ts
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
  enabled?: boolean;
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

export type AuthAction =
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_COMPANY_ID'; payload: string | undefined }
  | { type: 'SET_SESSION_ID'; payload: string | undefined }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_AUTH' };

export interface TokenPayload {
  exp: number;
  iat: number;
  user_id: number;
  jti: string;
}

export interface UserSession {
  userId: number;
  sessionId: string;
  companyId: string | null;
  token: string;
  refreshToken: string;
  user: AuthUser | null;
  expiresIn?: number;
}

export interface ValidateResponse {
  is_valid: boolean;
  user?: AuthUser;
  detail?: string;
}

// Error codes for authentication
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  UNAUTHORIZED = 'UNAUTHORIZED'
}

// Custom error class for authentication
export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  companyId?: string;
  sessionId?: string | undefined;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  companyId?: string;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signOut: (silent?: boolean) => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
  refreshUserInfo: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}


// src/auth/types/auth_types.ts
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
  enabled?: boolean;
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

export interface TokenPayload {
  exp: number;
  iat: number;
  user_id: number;
  jti: string;
}

export interface UserSession {
  userId: number;
  sessionId: string;
  companyId: string | null;
  token: string;
  refreshToken: string;
  user: AuthUser | null;
  expiresIn?: number;
}

export interface ValidateResponse {
  is_valid: boolean;
  user?: AuthUser;
  detail?: string;
}


export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  companyId?: string;
  sessionId?: string | undefined;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  companyId?: string;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signOut: (silent?: boolean) => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
  refreshUserInfo: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}


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



// src/types/auth_types.ts
export interface LoginCredentials {
  login: string;
  password: string;
}