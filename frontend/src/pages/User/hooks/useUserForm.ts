// src/pages/User/hooks/useUserForm.ts
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/pages/User/services';
import { USER_ROUTES } from '@/pages/User/routes';
import { userFormSchema } from '@/pages/User/utils';
import type { User } from '@/pages/User/types';

interface UseUserFormReturn {
  form: ReturnType<typeof useForm>;
  loading: boolean;
  error: string | null;
  isEditMode: boolean;
  onSubmit: (data: any) => Promise<void>;
  handleCancel: () => void;
}

export function useUserForm(): UseUserFormReturn {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const parsedId = id ? parseInt(id) : null;
  const isEditMode = !!parsedId && !isNaN(parsedId);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(!isEditMode);
  
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      user_name: '',
      email: '',
      login: '',
      password: '',
      password_confirm: '',
      type: 'user',
      company: '',
      is_active: true
    }
  });
  
  // Função para tratar erros da API e definir erros nos campos apropriados
  const handleApiErrors = (error: any) => {
    // Se houver dados de erro na resposta da API
    if (error.response && error.response.data) {
      const apiErrors = error.response.data;
      console.log('Erros retornados pela API:', apiErrors);
      
      // Percorre os erros retornados e define nos campos correspondentes
      Object.keys(apiErrors).forEach(fieldName => {
        if (Array.isArray(apiErrors[fieldName]) && apiErrors[fieldName].length > 0) {
          // Define o erro no campo específico do formulário
          form.setError(fieldName as any, {
            type: 'manual',
            message: apiErrors[fieldName][0]
          });
        }
      });
      
      // Exibe um toast com a mensagem genérica
      showToast({
        type: 'error',
        title: 'Erro no formulário',
        message: 'Verifique os campos do formulário'
      });
      
      return true; // Erros tratados
    }
    
    return false; // Erros não tratados
  };
  
  // Função para carregar dados do usuário
  const loadUserData = useCallback(async () => {
    if (!isEditMode || !parsedId) return;
  
    setLoading(true);
    try {
      console.log('Carregando usuário com ID:', parsedId);
      const user = await userService.getById(parsedId);
      console.log('Dados do usuário recebidos:', user);
      
      form.reset({
        user_name: user.user_name || '',
        email: user.email || '',
        login: user.login || '',
        password: '', // Não carregar senha
        password_confirm: '', // Não carregar confirmação de senha
        type: user.type || 'user',
        company: user.company_id || '',
        is_active: user.is_active !== undefined ? user.is_active : true
      });
      
    } catch (error: any) {
      console.error('Erro ao carregar usuário:', error);
      setError(error.message || 'Não foi possível carregar os dados do usuário');
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar dados do usuário'
      });
    } finally {
      setLoading(false);
      setInitialLoad(true);
    }
  }, [isEditMode, parsedId, form, showToast]);

  // Efeito para carregar dados apenas uma vez
  useEffect(() => {
    if (!initialLoad && isEditMode) {
      loadUserData();
    }
  }, [initialLoad, isEditMode, loadUserData]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      
      // Prepara os dados para envio
      const userData = {
        ...data,
        company_id: data.company || null // Mapeia company para company_id
      };
      
      // Remove campos não necessários para a API
      delete userData.company;
      
      // Se a senha estiver vazia, excluí-la do objeto no modo de edição
      if (isEditMode && !userData.password) {
        delete userData.password;
        delete userData.password_confirm;
      }
      
      if (isEditMode && parsedId) {
        console.log('Atualizando usuário com ID:', parsedId, 'Dados:', userData);
        await userService.update(parsedId, userData);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Usuário atualizado com sucesso'
        });
        navigate(USER_ROUTES.ROOT);
      } else {
        console.log('Criando novo usuário com dados:', userData);
        await userService.create(userData);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Usuário criado com sucesso'
        });
        navigate(USER_ROUTES.ROOT);
      }
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      
      // Tenta tratar erros específicos da API
      if (!handleApiErrors(error)) {
        // Se não houver erros específicos, exibe uma mensagem genérica
        showToast({
          type: 'error',
          title: 'Erro',
          message: error.message || 'Erro ao salvar usuário'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(USER_ROUTES.ROOT);
  };
  
  return {
    form,
    loading,
    error,
    isEditMode,
    onSubmit,
    handleCancel
  };
}