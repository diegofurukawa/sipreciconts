// src/auth/utils/authValidators.ts
import { z } from 'zod';

/**
 * Zod schema for login credentials validation
 */
export const loginCredentialsSchema = z.object({
  login: z.string()
    .min(3, { message: 'Usuário deve ter no mínimo 3 caracteres' })
    .max(100, { message: 'Usuário deve ter no máximo 100 caracteres' })
    .trim(),
  password: z.string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
    .max(100, { message: 'Senha deve ter no máximo 100 caracteres' })
});

export type LoginFormData = z.infer<typeof loginCredentialsSchema>;

/**
 * Zod schema for password reset request
 */
export const forgotPasswordSchema = z.object({
  email: z.string()
    .email({ message: 'Email inválido' })
    .trim()
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Zod schema for password reset
 */
export const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
    .max(100, { message: 'Senha deve ter no máximo 100 caracteres' }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword']
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Validates login credentials without using Zod (standalone function)
 */
export const validateLoginCredentials = (credentials: {
  login: string;
  password: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Validate login
  if (!credentials.login) {
    errors.login = 'Usuário é obrigatório';
  } else if (credentials.login.length < 3) {
    errors.login = 'Usuário deve ter no mínimo 3 caracteres';
  }
  
  // Validate password
  if (!credentials.password) {
    errors.password = 'Senha é obrigatória';
  } else if (credentials.password.length < 6) {
    errors.password = 'Senha deve ter no mínimo 6 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates a JWT token format (without decoding)
 */
export const isValidTokenFormat = (token: string): boolean => {
  // Simple regex to check JWT format
  const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
  return jwtPattern.test(token);
};