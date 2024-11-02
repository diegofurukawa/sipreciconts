// src/pages/Login/hooks/useLoginForm.ts
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { LoginFormData, LoginFormErrors, UseLoginFormReturn } from '../types';
import { validateLoginForm } from '../utils/validators';

export const useLoginForm = (): UseLoginFormReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({ username: '', password: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await signIn(formData);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          'Erro ao realizar login. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    error,
    handleChange,
    handleSubmit
  };
};