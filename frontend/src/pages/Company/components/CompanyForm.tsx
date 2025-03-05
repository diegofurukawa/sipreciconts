// src/pages/Company/components/CompanyForm.tsx
import { useForm } from 'react-hook-form';
import { useCompanyForm } from '@/pages/Company/hooks/useCompanyForm';
import { CompanyFormData } from '@/pages/Company/types/company_types';
import { companyValidators } from '@/pages/Company/utils/validators';

export const CompanyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CompanyFormData>({
    defaultValues: {
      enabled: true
    }
  });

  const { onSubmit, isLoading } = useCompanyForm();
  const isActive = watch('enabled');
  
  // Função para formatar o CNPJ no formato XX.XXX.XXX/XXXX-XX
  const formatCNPJ = (value: string) => {
    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Formata o CNPJ
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    } else if (numbers.length <= 12) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    } else {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
      {/* Identificação Section */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-md">Identificação</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Código da Empresa *
            </label>
            <input
              type="text"
              {...register('company_id', { 
                required: 'Código da empresa é obrigatório',
                maxLength: {
                  value: 10,
                  message: 'Código deve ter no máximo 10 caracteres'
                }
              })}
              placeholder="CO001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
            {errors.company_id && (
              <p className="mt-1 text-sm text-red-600">{errors.company_id.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Código único de identificação da empresa</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome da Empresa *
            </label>
            <input
              type="text"
              {...register('name', companyValidators.name)}
              placeholder="LOJAS G MOVEIS LTDA"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              CNPJ *
            </label>
            <input
              type="text"
              {...register('document', {
                required: 'CNPJ é obrigatório',
                onChange: (e) => {
                  const formatted = formatCNPJ(e.target.value);
                  e.target.value = formatted;
                  setValue('document', formatted);
                }
              })}
              placeholder="00.000.000/0001-00"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
            {errors.document && (
              <p className="mt-1 text-sm text-red-600">{errors.document.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contato Section */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-md">Contato</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="text"
              {...register('phone', {
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: 'Formato de telefone inválido'
                }
              })}
              placeholder="+5511987654321"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Digite apenas números, sem espaços ou caracteres especiais</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              placeholder="email@email.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Endereço Section */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-md">Endereço</h3>
        <div className="mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <textarea
              {...register('address')}
              placeholder="Rua Nome da Rua, 141, Bairro, Cidade Estado, CEP"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Informações do Sistema Section */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-md">Informações do Sistema</h3>
        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('enabled')}
              id="enabled"
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700">
              Ativo
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          onClick={() => window.history.back()}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;