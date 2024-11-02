import React from 'react';
import { useForm } from 'react-hook-form';
import { Customer } from '../../types/customer';
import { CustomerService } from '../../services/api';

interface CustomerFormProps {
  customer: Customer | null;
  companyId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  companyId,
  onSuccess,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<Customer>({
    defaultValues: {
      company_id: companyId,
      name: customer?.name || '',
      document: customer?.document || '',
      customer_type: customer?.customer_type || '',
      celphone: customer?.celphone || '',
      email: customer?.email || '',
      address: customer?.address || '',
      complement: customer?.complement || '',
      ...customer,
    },
  });

  const validatePhone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    if (numbers.length < 10 || numbers.length > 11) {
      return 'Celular deve ter 10 ou 11 dígitos';
    }
    return true;
  };

  const validateDocument = (value: string | undefined) => {
    if (!value) return true; // Documento é opcional
    const numbers = value.replace(/\D/g, '');
    if (numbers.length !== 11 && numbers.length !== 14) {
      return 'Documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos';
    }
    return true;
  };

  const validateEmail = (value: string | undefined) => {
    if (!value) return true; // Email é opcional
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value)) {
      return 'Email inválido';
    }
    return true;
  };

  const onSubmit = async (data: Customer) => {
    try {
      clearErrors();
      const submitData = {
        ...data,
        company_id: companyId,
        document: data.document?.replace(/\D/g, '') || null,
        celphone: data.celphone.replace(/\D/g, ''),
      };

      if (customer?.id) {
        await CustomerService.update(customer.id, submitData);
      } else {
        await CustomerService.create(submitData);
      }
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      if (error.response?.data) {
        // Handle backend validation errors
        Object.entries(error.response.data).forEach(([field, messages]) => {
          setError(field as keyof Customer, {
            type: 'backend',
            message: Array.isArray(messages) ? messages[0] : messages as string,
          });
        });
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">
        {customer ? 'Editar Cliente' : 'Novo Cliente'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('company_id')} value={companyId} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            {...register('name', { 
              required: 'Nome é obrigatório',
              minLength: { value: 3, message: 'Nome deve ter no mínimo 3 caracteres' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Celular *
          </label>
          <input
            type="text"
            {...register('celphone', {
              required: 'Celular é obrigatório',
              validate: validatePhone
            })}
            placeholder="(00) 00000-0000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.celphone && (
            <p className="mt-1 text-sm text-red-600">{errors.celphone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Documento (CPF/CNPJ)
          </label>
          <input
            type="text"
            {...register('document', {
              validate: validateDocument
            })}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.document && (
            <p className="mt-1 text-sm text-red-600">{errors.document.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Cliente
          </label>
          <select
            {...register('customer_type')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione um tipo</option>
            <option value="Individual">Individual</option>
            <option value="Empresarial">Empresarial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register('email', {
              validate: validateEmail
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço
          </label>
          <input
            type="text"
            {...register('address')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Complemento
          </label>
          <input
            type="text"
            {...register('complement')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            ) : (
              'Salvar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};