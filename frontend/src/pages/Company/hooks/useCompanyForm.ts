// src/pages/Company/hooks/useCompanyForm.ts
import React from 'react';
import { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/useToast';
import { companyService } from '../services/CompanyService';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';
// import type { Company } from '@/pages/Company/types/company_types';

// Schema de validação
const companyFormSchema = z.object({
  company_id: z.string().min(1, "Código é obrigatório").max(10, "Máximo 10 caracteres"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  document: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal('')),
  phone: z.string().optional(),
  enabled: z.boolean().default(true),
  address: z.string().optional()
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

export function useCompanyForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Converter e validar o ID para evitar NaN
  const parsedId = id ? parseInt(id) : null;
  const isEditMode = !!parsedId && !isNaN(parsedId);
  
  const [loading, setLoading] = React.useState(isEditMode);
  const [error, setError] = React.useState<string | null>(null);
  const [initialLoad, setInitialLoad] = React.useState(!isEditMode); // Controla o carregamento inicial
  
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      company_id: '',
      name: '',
      document: '',
      email: '',
      phone: '',
      enabled: true,
      address: ''
    }
  });

  // Função para carregar dados da empresa
  const loadCompanyData = useCallback(async () => {
    if (!isEditMode || !parsedId) return;

    setLoading(true);
    try {
      console.log('Carregando empresa com ID:', parsedId);
      const company = await companyService.getById(parsedId);
      console.log('Dados da empresa recebidos:', company);
      form.reset({
        company_id: company.company_id,
        name: company.name,
        document: company.document || '',
        email: company.email || '',
        phone: company.phone || '',
        enabled: company.enabled,
        address: company.address || ''
      });
    } catch (error: any) {
      console.error('Erro ao carregar empresa:', error);
      setError(error.message || 'Não foi possível carregar os dados da empresa');
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar dados da empresa'
      });
    } finally {
      setLoading(false);
      setInitialLoad(true); // Marca o carregamento inicial como concluído
    }
  }, [isEditMode, parsedId, form, showToast]);

  // Efeito para carregar dados apenas uma vez
  useEffect(() => {
    if (!initialLoad && isEditMode) {
      loadCompanyData();
    }
  }, [initialLoad, isEditMode, loadCompanyData]);

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setLoading(true);
      
      if (isEditMode && parsedId) {
        console.log('Atualizando empresa com ID:', parsedId, 'Dados:', data);
        await companyService.update(parsedId, data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Empresa atualizada com sucesso'
        });
      } else {
        console.log('Criando nova empresa com dados:', data);
        await companyService.create(data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Empresa criada com sucesso'
        });
      }
      
      navigate(CADASTROS_ROUTES.EMPRESA.ROOT);
    } catch (error: any) {
      console.error('Erro ao salvar empresa:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao salvar empresa'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    isEditMode,
    onSubmit,
    loadCompanyData
  };
}