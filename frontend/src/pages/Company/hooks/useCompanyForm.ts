// src/pages/Company/hooks/useCompanyForm.ts
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { apiService } from '@/services/api';
import { CompanyFormData, INITIAL_COMPANY_FORM_DATA } from '../types';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';

interface UseCompanyFormReturn {
  companyData: CompanyFormData;
  isLoading: boolean;
  isSubmitting: boolean;
  isEditMode: boolean;
  onSubmit: (data: CompanyFormData) => Promise<void>;
}

export const useCompanyForm = (): UseCompanyFormReturn => {
  const [companyData, setCompanyData] = useState<CompanyFormData>(INITIAL_COMPANY_FORM_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Carregar dados da empresa se estiver em modo de edição
  useEffect(() => {
    const loadCompany = async () => {
      if (isEditMode) {
        try {
          setIsLoading(true);
          const response = await apiService.get<CompanyFormData>(`/companies/${id}`);
          setCompanyData(response);
        } catch (error) {
          console.error('Erro ao carregar dados da empresa:', error);
          showToast({
            type: 'error',
            title: 'Erro',
            message: 'Não foi possível carregar os dados da empresa'
          });
          navigate(CADASTROS_ROUTES.EMPRESA.ROOT);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCompany();
  }, [id, isEditMode, navigate, showToast]);

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setIsSubmitting(true);
      
      // Converter company_id para maiúsculo
      const formattedData = {
        ...data,
        company_id: data.company_id.toUpperCase()
      };

      if (isEditMode) {
        await apiService.put(`/companies/${id}`, formattedData);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Empresa atualizada com sucesso!'
        });
      } else {
        // await apiService.post('/companies/add/', formattedData);
        await apiService.post('/companies/', formattedData);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Empresa cadastrada com sucesso!'
        });
      }
      
      navigate(CADASTROS_ROUTES.EMPRESA.ROOT);
    } catch (error: any) {
      console.error('Erro ao salvar empresa:', error);
      const errorMessage = error.response?.data?.detail || 
                          'Ocorreu um erro ao salvar os dados da empresa.';
      
      showToast({
        type: 'error',
        title: 'Erro',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    companyData,
    isLoading,
    isSubmitting,
    isEditMode,
    onSubmit
  };
};