// src/pages/SuppliesPriceList/hooks/useSuppliesPriceListForm.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/useToast';
import { suppliesPriceListService } from '@/pages/SuppliesPriceList/services';
import { SUPPLIES_PRICE_LIST_ROUTES } from '@/pages/SuppliesPriceList/routes';
import { suppliesPriceListFormSchema, type SuppliesPriceListFormSchema } from '@/pages/SuppliesPriceList/utils';
import type { SuppliesPriceList, SupplyOption, TaxOption } from '@/pages/SuppliesPriceList/types';

interface UseSuppliesPriceListFormReturn {
  form: ReturnType<typeof useForm<SuppliesPriceListFormSchema>>;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  isEditMode: boolean;
  supplies: SupplyOption[];
  taxes: TaxOption[];
  suppliesLoading: boolean;
  taxesLoading: boolean;
  onSubmit: (data: SuppliesPriceListFormSchema) => Promise<void>;
  handleCancel: () => void;
}

export function useSuppliesPriceListForm(): UseSuppliesPriceListFormReturn {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const parsedId = id ? parseInt(id) : null;
  const isEditMode = !!parsedId && !isNaN(parsedId);
  
  // Estado principal
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supplies, setSupplies] = useState<SupplyOption[]>([]);
  const [taxes, setTaxes] = useState<TaxOption[]>([]);
  const [suppliesLoading, setSuppliesLoading] = useState(true);
  const [taxesLoading, setTaxesLoading] = useState(true);
  
  // Refs para controlar carregamento
  const initializationDone = useRef(false);
  const dataInitialized = useRef(false);
  const suppliesRequested = useRef(false);
  const taxesRequested = useRef(false);
  const itemRequested = useRef(false);
  
  const form = useForm<SuppliesPriceListFormSchema>({
    resolver: zodResolver(suppliesPriceListFormSchema),
    defaultValues: {
      supply: 0,
      tax: 0,
      value: 0,
      sequence: 0
    }
  });
  
  // Inicialização única
  useEffect(() => {
    if (initializationDone.current) return;
    initializationDone.current = true;
    
    const initialize = async () => {
      if (suppliesRequested.current || taxesRequested.current) return;
      
      console.log('Inicializando formulário de preços');
      
      // Marcar como solicitado para evitar duplicação
      suppliesRequested.current = true;
      taxesRequested.current = true;
      
      try {
        // Carregar supplies e taxes em paralelo
        const [suppliesData, taxesData] = await Promise.all([
          suppliesPriceListService.getSupplies(),
          suppliesPriceListService.getTaxes()
        ]);
        
        setSupplies(suppliesData);
        setTaxes(taxesData);
        dataInitialized.current = true;
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        setError('Não foi possível carregar os dados necessários para o formulário');
      } finally {
        setSuppliesLoading(false);
        setTaxesLoading(false);
      }
    };
    
    initialize();
  }, []);
  
  // Carregar item para edição (apenas uma vez após inicialização de supplies/taxes)
  useEffect(() => {
    // Se não for modo de edição ou se já solicitou o item, sair
    if (!isEditMode || !parsedId || itemRequested.current) return;
    
    // Se os dados ainda não foram inicializados, aguardar
    if (!dataInitialized.current) return;
    
    // Marcar como solicitado para evitar duplicação
    itemRequested.current = true;
    
    const loadItem = async () => {
      setLoading(true);
      try {
        console.log('Carregando item para edição:', parsedId);
        const item = await suppliesPriceListService.getById(parsedId);
        
        form.reset({
          supply: item.supply,
          tax: item.tax,
          value: typeof item.value === 'string' ? parseFloat(item.value) : item.value,
          sequence: item.sequence || 0
        });
      } catch (error: any) {
        console.error('Erro ao carregar item:', error);
        setError(error.message || 'Não foi possível carregar os dados do item');
        showToast({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao carregar dados do item'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadItem();
  }, [isEditMode, parsedId, form, showToast, dataInitialized.current]);

  // Form submission
  const onSubmit = async (data: SuppliesPriceListFormSchema) => {
    try {
      setSubmitting(true);
      
      if (isEditMode && parsedId) {
        console.log('Atualizando item:', parsedId, 'Dados:', data);
        await suppliesPriceListService.update(parsedId, data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Item atualizado com sucesso'
        });
      } else {
        console.log('Criando novo item com dados:', data);
        await suppliesPriceListService.create(data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Item criado com sucesso'
        });
      }
      
      navigate(SUPPLIES_PRICE_LIST_ROUTES.ROOT);
    } catch (error: any) {
      console.error('Erro ao salvar item:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao salvar item'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel and navigate back
  const handleCancel = () => {
    navigate(SUPPLIES_PRICE_LIST_ROUTES.ROOT);
  };
  
  // Estado de loading efetivo
  const effectiveLoading = loading || (suppliesLoading || taxesLoading);
  
  return {
    form,
    loading: effectiveLoading,
    submitting,
    error,
    isEditMode,
    supplies,
    taxes,
    suppliesLoading,
    taxesLoading,
    onSubmit,
    handleCancel
  };
}