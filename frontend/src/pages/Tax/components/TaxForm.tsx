// src/components/Tax/TaxForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { taxService, type Tax } from '@/services/api/modules/Tax';
import { useToast } from '@/hooks/useToast';

interface TaxFormProps {
  tax: Tax | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Opções para selects
const TAX_TYPE_OPTIONS = [
  { value: 'tax', label: 'Imposto' },
  { value: 'fee', label: 'Taxa' }
];

const TAX_GROUP_OPTIONS = [
  { value: 'federal', label: 'Federal' },
  { value: 'state', label: 'Estadual' },
  { value: 'municipal', label: 'Municipal' },
  { value: 'other', label: 'Outro' }
];

const CALC_OPERATOR_OPTIONS = [
  { value: '%', label: 'Percentual' },
  { value: '0', label: 'Fixo' },
  { value: '+', label: 'Adição' },
  { value: '-', label: 'Subtração' },
  { value: '*', label: 'Multiplicação' },
  { value: '/', label: 'Divisão' }
];

export const TaxForm: React.FC<TaxFormProps> = ({ tax, onSuccess, onCancel }) => {
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Tax>({
    defaultValues: tax || {
      acronym: '',
      description: '',
      type: 'tax',
      group: 'federal',
      calc_operator: '%',
      value: 0
    }
  });

  const watchOperator = watch('calc_operator');

  const onSubmit = async (data: Tax) => {
    try {
      setSubmitting(true);
      
      // Convert value to number
      data.value = parseFloat(data.value.toString());
      
      if (tax?.id) {
        // Update existing tax
        await taxService.update(tax.id, data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Imposto atualizado com sucesso'
        });
      } else {
        // Create new tax
        await taxService.create(data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Imposto criado com sucesso'
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving tax:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao salvar imposto'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Acronym */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sigla *
        </label>
        <input
          type="text"
          {...register('acronym', { 
            required: 'Sigla é obrigatória',
            maxLength: { value: 10, message: 'Sigla deve ter no máximo 10 caracteres' } 
          })}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
            errors.acronym ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="ICMS"
        />
        {errors.acronym && (
          <p className="mt-1 text-sm text-red-600">{errors.acronym.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <input
          type="text"
          {...register('description')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="Imposto sobre Circulação de Mercadorias e Serviços"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo *
        </label>
        <select
          {...register('type', { required: 'Tipo é obrigatório' })}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
            errors.type ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          {TAX_TYPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      {/* Group */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Grupo *
        </label>
        <select
          {...register('group', { required: 'Grupo é obrigatório' })}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
            errors.group ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          {TAX_GROUP_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.group && (
          <p className="mt-1 text-sm text-red-600">{errors.group.message}</p>
        )}
      </div>

      {/* Calculation Operator */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Operador de Cálculo *
        </label>
        <select
          {...register('calc_operator', { required: 'Operador é obrigatório' })}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
            errors.calc_operator ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          {CALC_OPERATOR_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.calc_operator && (
          <p className="mt-1 text-sm text-red-600">{errors.calc_operator.message}</p>
        )}
      </div>

      {/* Value */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor *
          {watchOperator === '%' && <span className="text-xs text-gray-500 ml-1">(em percentual)</span>}
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            {...register('value', { 
              required: 'Valor é obrigatório',
              min: { value: 0, message: 'Valor deve ser positivo' },
              valueAsNumber: true
            })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
              errors.value ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {watchOperator === '%' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">%</span>
            </div>
          )}
        </div>
        {errors.value && (
          <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {watchOperator === '%' 
            ? 'Digite o valor percentual (ex: 18 para 18%)' 
            : 'Digite o valor numérico para o cálculo'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end pt-4 space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            'Salvar'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaxForm;