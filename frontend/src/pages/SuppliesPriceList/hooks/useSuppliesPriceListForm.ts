// src/pages/SuppliesPriceList/hooks/useSuppliesPriceListForm.ts
import { useState, useCallback, useEffect } from 'react';
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
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(!isEditMode);
  const [supplies, setSupplies] = useState<SupplyOption[]>([]);
  const [taxes, setTaxes] = useState<TaxOption[]>([]);
  const [suppliesLoading, setSuppliesLoading] = useState(true);
  const [taxesLoading, setTaxesLoading] = useState(true);
  
  const form = useForm<SuppliesPriceListFormSchema>({
    resolver: zodResolver(suppliesPriceListFormSchema),
    defaultValues: {
      supply: 0,
      tax: 0,
      value: 0,
      sequence: 0
    }
  });
  
  // Load supply options
  const loadSupplies = async () => {
    try {
      setSuppliesLoading(true);
      const supplies = await suppliesPriceListService.getSupplies();
      setSupplies(supplies);
    } catch (error) {
      console.error('Error loading supplies:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar lista de insumos'
      });
    } finally {
      setSuppliesLoading(false);
    }
  };
  
  // Load tax options
  const loadTaxes = async () => {
    try {
      setTaxesLoading(true);
      const taxes = await suppliesPriceListService.getTaxes();
      setTaxes(taxes);
    } catch (error) {
      console.error('Error loading taxes:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar lista de impostos'
      });
    } finally {
      setTaxesLoading(false);
    }
  };
  
  // Load item data for editing
  const loadItemData = useCallback(async () => {
    if (!isEditMode || !parsedId) return;
  
    setLoading(true);
    try {
      console.log('Loading supplies price list item with ID:', parsedId);
      const item = await suppliesPriceListService.getById(parsedId);
      console.log('Item data received:', item);
      
      form.reset({
        supply: item.supply,
        tax: item.tax,
        value: typeof item.value === 'string' ? parseFloat(item.value) : item.value,
        sequence: item.sequence || 0
      });
      
    } catch (error: any) {
      console.error('Error loading supplies price list item:', error);
      setError(error.message || 'Não foi possível carregar os dados do item');
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar dados do item'
      });
    } finally {
      setLoading(false);
      setInitialLoad(true);
    }
  }, [isEditMode, parsedId, form, showToast]);

  // Initial load
  useEffect(() => {
    // Load reference data
    loadSupplies();
    loadTaxes();
    
    // Load item data if in edit mode
    if (!initialLoad && isEditMode) {
      loadItemData();
    }
  }, [initialLoad, isEditMode, loadItemData]);

  // Form submission
  const onSubmit = async (data: SuppliesPriceListFormSchema) => {
    try {
      setSubmitting(true);
      
      if (isEditMode && parsedId) {
        console.log('Updating supplies price list item with ID:', parsedId, 'Data:', data);
        await suppliesPriceListService.update(parsedId, data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Item atualizado com sucesso'
        });
      } else {
        console.log('Creating new supplies price list item with data:', data);
        await suppliesPriceListService.create(data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Item criado com sucesso'
        });
      }
      
      navigate(SUPPLIES_PRICE_LIST_ROUTES.ROOT);
    } catch (error: any) {
      console.error('Error saving supplies price list item:', error);
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
  
  return {
    form,
    loading,
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