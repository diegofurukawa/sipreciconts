// src/pages/User/utils/UserValidators.ts
import { z } from 'zod';
import type { PasswordValidationResult } from '@/pages/User/types';

export const userFormSchema = z.object({
  user_name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  login: z.string().min(3, 'Login deve ter no mínimo 3 caracteres').max(150, 'Login deve ter no máximo 150 caracteres'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .optional()
    .or(z.literal('')),
  password_confirm: z.string()
    .optional()
    .or(z.literal('')),
  type: z.string().min(1, 'Tipo de usuário é obrigatório'),
  company: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true)
}).refine((data) => {
  // Se a senha estiver preenchida, a confirmação também deve estar e ser igual
  if (data.password && data.password !== data.password_confirm) {
    return false;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["password_confirm"]
});

export type UserFormSchema = z.infer<typeof userFormSchema>;

/**
 * Valida a força da senha
 * @param password Senha a ser validada
 * @returns Objeto com resultado da validação
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  if (!password) {
    return { valid: false, message: 'Senha é obrigatória', score: 0 };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Senha deve ter pelo menos 8 caracteres', score: 0 };
  }

  let score = 0;
  
  // Verifica caracteres minúsculos
  if (/[a-z]/.test(password)) score += 1;
  
  // Verifica caracteres maiúsculos
  if (/[A-Z]/.test(password)) score += 1;
  
  // Verifica números
  if (/[0-9]/.test(password)) score += 1;
  
  // Verifica caracteres especiais
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  // Comprimento mínimo para pontuação adicional
  if (password.length >= 12) score += 1;

  // Verifica se há requisitos mínimos
  if (score < 3) {
    return {
      valid: false,
      message: 'Senha deve conter pelo menos 3 dos seguintes: letra maiúscula, letra minúscula, número e caractere especial',
      score
    };
  }

  return { valid: true, score };
}

/**
 * Avalia o nível de segurança da senha
 * @param score Pontuação da senha
 * @returns Nível de segurança como string
 */
export function getPasswordStrengthLevel(score: number): 'fraca' | 'média' | 'forte' | 'muito forte' {
  if (score <= 2) return 'fraca';
  if (score === 3) return 'média';
  if (score === 4) return 'forte';
  return 'muito forte';
}

export default {
  userFormSchema,
  validatePasswordStrength,
  getPasswordStrengthLevel
};