import { useState } from 'react';
import { useAuth } from "@/core/auth";
import type { AuthCredentials } from '@/services/api/modules/auth';

interface LoginFormData extends AuthCredentials {
  login: string;
  password: string;
}

interface LoginFormErrors {
  login?: string;
  password?: string;
}

interface UseLoginFormReturn {
  formData: LoginFormData;
  errors: LoginFormErrors;
  isSubmitting: boolean;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const { signIn } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({ 
    login: '', 
    password: '' 
  });
  
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    
    const trimmedLogin = formData.login.trim();
    const trimmedPassword = formData.password.trim();
    
    if (!trimmedLogin) {
      newErrors.login = 'Usuário é obrigatório';
    } else if (trimmedLogin.length < 3) {
      newErrors.login = 'Usuário deve ter no mínimo 3 caracteres';
    }
    
    if (!trimmedPassword) {
      newErrors.password = 'Senha é obrigatória';
    } else if (trimmedPassword.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Remove espaços em branco no início e fim para validação
    const trimmedValue = value.trim();
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: value // Mantém o valor original no estado
    }));
    
    // Limpa erros quando o usuário digita
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Limpa mensagens de erro anteriores
    setError('');
    setErrors({});

    // Validação do formulário
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepara os dados conforme esperado pelo backend
      const credentials = {
        username: formData.login.trim(), // Alterado para username conforme esperado pelo backend
        password: formData.password.trim()
      };

      // Log para debug (remover em produção)
      console.debug('Enviando credenciais:', {
        username: credentials.username,
        password: '[PROTEGIDO]'
      });

      // Envia credenciais para o signIn
      await signIn({
        login: credentials.username, // Mantém compatibilidade com a interface AuthCredentials
        password: credentials.password
      });

      // Limpa o formulário após o sucesso
      resetForm();
      
    } catch (err: any) {
      console.error('Erro no login:', err);
      
      // Tratamento de erros melhorado
      let errorMessage = 'Erro ao realizar login. Tente novamente.';
      
      if (err.code === 'INVALID_CREDENTIALS') {
        errorMessage = 'Usuário ou senha inválidos';
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (err.code === 'SERVER_ERROR') {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message && typeof err.message === 'string') {
        errorMessage = err.message;
      }
      
      // Define o erro para exibição
      setError(errorMessage);
      
      // Limpa a senha em caso de erro
      setFormData(prev => ({
        ...prev,
        password: ''
      }));
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ login: '', password: '' });
    setErrors({});
    setError('');
    setIsSubmitting(false);
  };

  return {
    formData,
    errors,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
    resetForm
  };
};

// Export types
export type { 
  LoginFormData, 
  LoginFormErrors, 
  UseLoginFormReturn 
};