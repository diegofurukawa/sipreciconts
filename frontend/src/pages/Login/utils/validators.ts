// src/pages/Login/utils/validators.ts
import { LoginFormData, LoginFormErrors } from '../types';

export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};
  
  if (!data.login.trim()) {
    errors.login = 'Usuário é obrigatório';
  }
  
  if (!data.password) {
    errors.password = 'Senha é obrigatória';
  } else if (data.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres';
  }
  
  return errors;
};