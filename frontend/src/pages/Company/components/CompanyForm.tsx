// src/pages/Company/components/CompanyForm.tsx
import { useForm } from 'react-hook-form';
import { useCompanyForm } from '../hooks/useCompanyForm';
import { CompanyFormData } from '../types';
import { companyValidators } from '../utils/validators';

export const CompanyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>();

  const { onSubmit, isLoading } = useCompanyForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome da Empresa *
          </label>
          <input
            type="text"
            {...register('name', companyValidators.name)}
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
            {...register('document', companyValidators.document)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          />
          {errors.document && (
            <p className="mt-1 text-sm text-red-600">{errors.document.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
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
