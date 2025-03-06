// src/pages/Customer/hooks/useCustomerForm.ts
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/useToast';
import { customerService } from '@/services/api/modules/customer';
import { customerFormSchema, type CustomerFormSchema } from '../utils/validators';
import type { Customer } from '../types/customer_types';

interface UseCustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

interface ValidationStatus {
  field: string;
  isValidating: boolean;
  error?: string;
}

const useCustomerForm = ({
  customer,
  onSuccess,
  onError
}: UseCustomerFormProps = {}) => {
  const [loading, setLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | null>(null);
  const { showToast } = useToast();

  const form = useForm<CustomerFormSchema>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer || {
      name: '',
      document: '',
      customer_type: '',
      celphone: '',
      email: '',
      address: '',
      complement: ''
    }
  });

  // Validação em tempo real de documento
  const validateDocument = useCallback(async (document: string) => {
    if (!document || document === customer?.document) return true;

    try {
      setValidationStatus({ field: 'document', isValidating: true });
      const result = await customerService.checkDocumentExists(document);
      
      if (result.exists) {
        setValidationStatus({
          field: 'document',
          isValidating: false,
          error: 'Este documento já está cadastrado'
        });
        return false;
      }

      setValidationStatus({ field: 'document', isValidating: false });
      return true;
    } catch (error) {
      setValidationStatus({
        field: 'document',
        isValidating: false,
        error: 'Erro ao validar documento'
      });
      return false;
    }
  }, [customer?.document]);

  // Validação completa dos dados
  const validateData = useCallback(async (data: CustomerFormSchema): Promise<boolean> => {
    try {
      setLoading(true);
      const validation = await customerService.validate(data);
      
      if (!validation.valid && validation.errors) {
        Object.entries(validation.errors).forEach(([field, errors]) => {
          form.setError(field as any, {
            type: 'manual',
            message: errors[0]
          });
        });
        return false;
      }
      
      return true;
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao validar dados do cliente'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [form, showToast]);

  // Submit com validação
  const onSubmit = async (data: CustomerFormSchema) => {
    try {
      setLoading(true);

      // Validação do documento
      if (data.document && !(await validateDocument(data.document))) {
        return;
      }

      // Validação completa dos dados
      if (!(await validateData(data))) {
        return;
      }

      if (customer?.customer_id) {
        // Se for atualização parcial, usa PATCH
        const hasPartialData = Object.keys(data).length < Object.keys(customerFormSchema.shape).length;
        if (hasPartialData) {
          await customerService.patch(customer.customer_id, data);
        } else {
          await customerService.update(customer.customer_id, data);
        }
      } else {
        await customerService.create(data);
      }

      showToast({
        type: 'success',
        title: 'Sucesso',
        message: `Cliente ${customer ? 'atualizado' : 'criado'} com sucesso`
      });

      onSuccess?.();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: `Erro ao ${customer ? 'atualizar' : 'criar'} cliente`
      });
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  // Utilitário para limpar validações
  const clearValidation = useCallback(() => {
    setValidationStatus(null);
  }, []);

  return {
    form,
    loading,
    onSubmit,
    validateDocument,
    validateData,
    validationStatus,
    clearValidation
  };
};


export {
  useCustomerForm
};