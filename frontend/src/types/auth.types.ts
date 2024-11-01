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