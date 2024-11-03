// src/pages/Customer/hooks/useCustomerForm.ts
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/useToast';
import { CustomerService } from '@/services/api';
import { customerFormSchema, type CustomerFormSchema } from '../utils/validators';
import type { Customer } from '../types';

const useCustomerForm = (
  customer?: Customer,
  onSuccess?: () => void
) => {
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (data: CustomerFormSchema) => {
    try {
      setLoading(true);
      if (customer?.customer_id) {
        await CustomerService.update(customer.customer_id, data);
      } else {
        await CustomerService.create(data);
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
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    onSubmit
  };
};


export {
    useCustomerForm
};