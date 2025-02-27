// src/pages/Tax/components/TaxForm.tsx
import React, { useState } from 'react';

// Definição da interface Tax se ainda não tiver sido importada
export interface Tax {
  id?: number;
  acronym: string;
  description: string;
  type: string;
  group: string;
  calc_operator: string;
  value: number;
}

// Opções estáticas para os selects
const TAX_TYPE_LABELS = {
  'tax': 'Imposto',
  'fee': 'Taxa'
};

const TAX_GROUP_LABELS = {
  'federal': 'Federal',
  'state': 'Estadual',
  'municipal': 'Municipal',
  'other': 'Outro'
};

const CALC_OPERATOR_LABELS = {
  '%': 'Percentual',
  '0': 'Fixo',
  '+': 'Adição',
  '-': 'Subtração',
  '*': 'Multiplicação',
  '/': 'Divisão'
};

interface TaxFormProps {
  tax: Tax | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const TaxForm: React.FC<TaxFormProps> = ({
  tax,
  onSuccess,
  onCancel,
}) => {
  // Usando useState em vez de react-hook-form para simplificar
  const [formData, setFormData] = useState<Tax>({
    acronym: tax?.acronym || '',
    description: tax?.description || '',
    type: tax?.type || 'tax',
    group: tax?.group || 'federal',
    calc_operator: tax?.calc_operator || '%',
    value: tax?.value || 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.acronym) {
      newErrors.acronym = 'Sigla é obrigatória';
    }
    
    if (!formData.type) {
      newErrors.type = 'Tipo é obrigatório';
    }
    
    if (!formData.group) {
      newErrors.group = 'Grupo é obrigatório';
    }
    
    if (!formData.calc_operator) {
      newErrors.calc_operator = 'Operador é obrigatório';
    }
    
    if (formData.value < 0) {
      newErrors.value = 'Valor deve ser maior ou igual a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) : value
    }));
    
    // Limpar erro do campo quando alterado
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Em uma implementação real, chamaríamos o service
      // if (tax?.id) {
      //   await TaxService.update(tax.id, formData);
      // } else {
      //   await TaxService.create(formData);
      // }
      
      // Simulando uma chamada de API com um timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar imposto:', error);
      // Adicionar tratamento de erro adequado aqui
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">
          {tax ? 'Editar Imposto' : 'Novo Imposto'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Descrição *
            </label>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`shadow appearance-none border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              type="text"
              placeholder="Digite a descrição"
            />
            {errors.description && (
              <p className="text-red-500 text-xs italic">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Sigla *
            </label>
            <input
              name="acronym"
              value={formData.acronym}
              onChange={handleChange}
              className={`shadow appearance-none border ${errors.acronym ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              type="text"
              placeholder="Digite a sigla"
              maxLength={10}
            />
            {errors.acronym && (
              <p className="text-red-500 text-xs italic">
                {errors.acronym}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tipo *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`shadow appearance-none border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            >
              <option value="">Selecione...</option>
              {Object.entries(TAX_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs italic">
                {errors.type}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Grupo *
            </label>
            <select
              name="group"
              value={formData.group}
              onChange={handleChange}
              className={`shadow appearance-none border ${errors.group ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            >
              <option value="">Selecione...</option>
              {Object.entries(TAX_GROUP_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.group && (
              <p className="text-red-500 text-xs italic">
                {errors.group}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Operador de Cálculo *
            </label>
            <select
              name="calc_operator"
              value={formData.calc_operator}
              onChange={handleChange}
              className={`shadow appearance-none border ${errors.calc_operator ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            >
              <option value="">Selecione...</option>
              {Object.entries(CALC_OPERATOR_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.calc_operator && (
              <p className="text-red-500 text-xs italic">
                {errors.calc_operator}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Valor *
            </label>
            <input
              name="value"
              value={formData.value}
              onChange={handleChange}
              className={`shadow appearance-none border ${errors.value ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              type="number"
              step="0.0001"
              placeholder="0,0000"
            />
            {errors.value && (
              <p className="text-red-500 text-xs italic">
                {errors.value}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { TaxForm };
export default TaxForm;