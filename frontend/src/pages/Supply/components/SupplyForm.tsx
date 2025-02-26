// src/components/Supply/SupplyForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Supply, UNIT_MEASURES, SUPPLY_TYPES } from '../../types/supply';
import { SupplyService } from '../../services/api/supply';

interface SupplyFormProps {
  supply: Supply | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const SupplyForm: React.FC<SupplyFormProps> = ({
  supply,
  onSuccess,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Supply>({
    defaultValues: supply || {
      unit_measure: 'UN',
      type: 'MAT'
    },
  });

  const onSubmit = async (data: Supply) => {
    try {
      if (supply?.id) {
        await SupplyService.update(supply.id, data);
      } else {
        await SupplyService.create(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar insumo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome *
        </label>
        <input
          type="text"
          {...register('name', { required: 'Nome é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Apelido
        </label>
        <input
          type="text"
          {...register('nick_name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Código EAN
        </label>
        <input
          type="text"
          {...register('ean_code')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          {...register('description')}
          rows={3}
// src/components/Supply/SupplyForm.tsx (continuação)
className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700">
  Tipo *
</label>
<select
  {...register('type', { required: 'Tipo é obrigatório' })}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
>
  {SUPPLY_TYPES.map(type => (
    <option key={type.value} value={type.value}>
      {type.label}
    </option>
  ))}
</select>
{errors.type && (
  <span className="text-red-500 text-sm">{errors.type.message}</span>
)}
</div>

<div>
<label className="block text-sm font-medium text-gray-700">
  Unidade de Medida *
</label>
<select
  {...register('unit_measure', { required: 'Unidade de medida é obrigatória' })}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
>
  {UNIT_MEASURES.map(measure => (
    <option key={measure.value} value={measure.value}>
      {measure.label}
    </option>
  ))}
</select>
{errors.unit_measure && (
  <span className="text-red-500 text-sm">{errors.unit_measure.message}</span>
)}
</div>

<div className="flex justify-end space-x-2 pt-4">
<button
  type="button"
  onClick={onCancel}
  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
>
  Cancelar
</button>
<button
  type="submit"
  className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
>
  Salvar
</button>
</div>
</form>
);
};

export default SupplyForm;