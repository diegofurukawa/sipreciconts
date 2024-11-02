// src/pages/Company/hooks/useCompanyForm.ts
import { useState } from 'react';
import { CompanyFormData } from '../types';
import { api } from '../../../services/api';
import { useToast } from '../../../hooks/useToast';

export const useCompanyForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setIsLoading(true);
      await api.post('/companies/', data);
      showToast({
        type: 'success',
        title: 'Sucesso!',
        message: 'Empresa cadastrada com sucesso.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro!',
        message: 'Erro ao cadastrar empresa.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onSubmit,
    isLoading
  };
};