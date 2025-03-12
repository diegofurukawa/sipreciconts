// src/pages/User/types/UserTypes.ts

/**
 * Interface do usuário no sistema
 */
export interface User {
  id?: number;
  login: string;
  email: string;
  user_name: string;
  password?: string;
  type: string;
  company_id: string | null;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

/**
 * Tipo para dados do formulário de usuário
 */
export interface UserFormData {
  name: string;
  email: string;
  username: string;
  password: string;
  user_type: string;
  company_id: string | null;
  enabled: boolean;
}

/**
 * Tipos de usuário disponíveis no sistema
 */
export const USER_TYPES = [
  { value: 'Admin', label: 'Administrador' },
  { value: 'Usuario', label: 'Usuário Padrão' },
  { value: 'viewer', label: 'Visualizador' }
];

/**
 * Requisição para criar usuário
 */
export interface CreateUserRequest extends Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login'> {}

/**
 * Requisição para atualizar usuário
 */
export interface UpdateUserRequest extends Partial<CreateUserRequest> {}

/**
 * Parâmetros para listagem de usuários
 */
export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  user_type?: string;
  company_id?: string;
  enabled?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Resposta paginada da API
 */
export interface PaginatedUserResponse {
  results: User[];
  count: number;
  total_pages: number;
  current_page: number;
}

/**
 * Resultado da validação de senha
 */
export interface PasswordValidationResult {
  valid: boolean;
  message?: string;
  score?: number;
}

// Adicionar as exportações faltantes
export const USER_TYPE_LABELS: Record<string, string> = {
  'admin': 'Administrador',
  'user': 'Usuário Padrão',
  'viewer': 'Visualizador'
};

/**
 * Formata data para exibição
 */
export const formatDate = (date?: string): string => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return date;
  }
};

export default User;