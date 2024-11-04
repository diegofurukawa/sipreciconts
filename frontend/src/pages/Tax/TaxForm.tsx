// src/components/Tax/TaxForm.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { 
 Tax, 
 TAX_TYPE_LABELS, 
 TAX_GROUP_LABELS, 
 CALC_OPERATOR_LABELS 
} from '../../types';
import { TaxService } from '../../services/api';

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
 const {
   register,
   handleSubmit,
   formState: { errors },
 } = useForm<Tax>({
   defaultValues: tax || {},
 });

 const onSubmit = async (data: Tax) => {
   try {
     if (tax?.id) {
       await TaxService.update(tax.id, data);
     } else {
       await TaxService.create(data);
     }
     onSuccess();
   } catch (error) {
     console.error('Erro ao salvar imposto:', error);
   }
 };

 return (
   <div className="container mx-auto p-4">
     <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
       <h2 className="text-xl font-bold mb-4">
         {tax ? 'Editar Imposto' : 'Novo Imposto'}
       </h2>
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         <div>
           <label className="block text-gray-700 text-sm font-bold mb-2">
             Descrição *
           </label>
           <input
             {...register('description', { required: 'Descrição é obrigatória' })}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
             type="text"
             placeholder="Digite a descrição"
           />
           {errors.description && (
             <p className="text-red-500 text-xs italic">
               {errors.description.message}
             </p>
           )}
         </div>

         <div>
           <label className="block text-gray-700 text-sm font-bold mb-2">
             Sigla *
           </label>
           <input
             {...register('acronym', { required: 'Sigla é obrigatória' })}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
             type="text"
             placeholder="Digite a sigla"
             maxLength={10}
           />
           {errors.acronym && (
             <p className="text-red-500 text-xs italic">
               {errors.acronym.message}
             </p>
           )}
         </div>

         <div>
           <label className="block text-gray-700 text-sm font-bold mb-2">
             Tipo *
           </label>
           <select
             {...register('type', { required: 'Tipo é obrigatório' })}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           >
             <option value="">Selecione...</option>
             {Object.entries(TAX_TYPE_LABELS).map(([value, label]) => (
               <option key={value} value={value}>{label}</option>
             ))}
           </select>
           {errors.type && (
             <p className="text-red-500 text-xs italic">
               {errors.type.message}
             </p>
           )}
         </div>

         <div>
           <label className="block text-gray-700 text-sm font-bold mb-2">
             Grupo *
           </label>
           <select
             {...register('group', { required: 'Grupo é obrigatório' })}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           >
             <option value="">Selecione...</option>
             {Object.entries(TAX_GROUP_LABELS).map(([value, label]) => (
               <option key={value} value={value}>{label}</option>
             ))}
           </select>
           {errors.group && (
             <p className="text-red-500 text-xs italic">
               {errors.group.message}
             </p>
           )}
         </div>

         <div>
           <label className="block text-gray-700 text-sm font-bold mb-2">
             Operador de Cálculo *
           </label>
           <select
             {...register('calc_operator', { required: 'Operador é obrigatório' })}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           >
             <option value="">Selecione...</option>
             {Object.entries(CALC_OPERATOR_LABELS).map(([value, label]) => (
               <option key={value} value={value}>{label}</option>
             ))}
           </select>
           {errors.calc_operator && (
             <p className="text-red-500 text-xs italic">
               {errors.calc_operator.message}
             </p>
           )}
         </div>

         <div>
           <label className="block text-gray-700 text-sm font-bold mb-2">
             Valor *
           </label>
           <input
             {...register('value', { 
               required: 'Valor é obrigatório',
               min: {
                 value: 0,
                 message: 'Valor deve ser maior ou igual a 0'
               },
               validate: value => 
                 !isNaN(Number(value)) || 'Valor deve ser um número válido'
             })}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
             type="number"
             step="0.0001"
             placeholder="0,0000"
           />
           {errors.value && (
             <p className="text-red-500 text-xs italic">
               {errors.value.message}
             </p>
           )}
         </div>

         <div className="flex items-center justify-end space-x-2 pt-4">
           <button
             type="button"
             onClick={onCancel}
             className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
           >
             Cancelar
           </button>
           <button
             type="submit"
             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
           >
             Salvar
           </button>
         </div>
       </form>
     </div>
   </div>
 );
};

export default TaxForm;