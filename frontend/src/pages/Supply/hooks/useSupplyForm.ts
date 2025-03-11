// src/pages/Supply/hooks/useSupplyForm.ts
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/useToast';
import { SupplyService } from '@/pages/Supply/services';
import { SUPPLY_ROUTES } from '@/pages/Supply/routes';
import { supplyFormSchema, type SupplyFormSchema } from '@/pages/Supply/utils';
import type { Supply } from '@/pages/Supply/types';

interface UseSupplyFormReturn {
  form: ReturnType<typeof useForm<SupplyFormSchema>>;
  loading: boolean;
  error: string | null;
  isEditMode: boolean;
  onSubmit: (data: SupplyFormSchema) => Promise<void>;
  handleCancel: () => void;
}

export function useSupplyForm(): UseSupplyFormReturn {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const parsedId = id ? parseInt(id) : null;
  const isEditMode = !!parsedId && !isNaN(parsedId);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(!isEditMode); // Controla o carregamento inicial
  
  const form = useForm<SupplyFormSchema>({
    resolver: zodResolver(supplyFormSchema),
    defaultValues: {
      name: '',
      nick_name: '',
      ean_code: '',
      description: '',
      type: 'MAT',
      unit_measure: 'UN'
    }
  });
  
  // Função para carregar dados do insumo
  const loadSupplyData = useCallback(async () => {
    if (!isEditMode || !parsedId) return;
  
    setLoading(true);
    try {
      console.log('Carregando insumo com ID:', parsedId);
      const supply = await SupplyService.getById(parsedId);
      console.log('Dados do insumo recebidos:', supply);
      
      form.reset({
        name: supply.name,
        nick_name: supply.nick_name || '',
        ean_code: supply.ean_code || '',
        description: supply.description || '',
        type: supply.type,
        unit_measure: supply.unit_measure
      });
      
    } catch (error: any) {
      console.error('Erro ao carregar insumo:', error);
      setError(error.message || 'Não foi possível carregar os dados do insumo');
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar dados do insumo'
      });
    } finally {
      setLoading(false);
      setInitialLoad(true); // Marca o carregamento inicial como concluído
    }
  }, [isEditMode, parsedId, form, showToast]);

  // Efeito para carregar dados apenas uma vez
  useEffect(() => {
    if (!initialLoad && isEditMode) {
      loadSupplyData();
    }
  }, [initialLoad, isEditMode, loadSupplyData]);

  const onSubmit = async (data: SupplyFormSchema) => {
    try {
      setLoading(true);
      
      if (isEditMode && parsedId) {
        console.log('Atualizando insumo com ID:', parsedId, 'Dados:', data);
        await SupplyService.update(parsedId, data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Insumo atualizado com sucesso'
        });
      } else {
        console.log('Criando novo insumo com dados:', data);
        await SupplyService.create(data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Insumo criado com sucesso'
        });
      }
      
      navigate(SUPPLY_ROUTES.ROOT);
    } catch (error: any) {
      console.error('Erro ao salvar insumo:', error);
      
      // Exibir mensagem de erro detalhada
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao salvar insumo'
      });
      
      // Se o erro estiver relacionado a campos específicos, podemos definir erros no formulário
      if (error.response && error.response.data) {
        const fieldErrors = error.response.data;
        
        // Para cada campo com erro, definimos o erro no formulário
        Object.entries(fieldErrors).forEach(([field, errors]) => {
          if (Array.isArray(errors) && errors.length > 0) {
            form.setError(field as any, {
              type: 'manual',
              message: errors[0]
            });
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(SUPPLY_ROUTES.ROOT);
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