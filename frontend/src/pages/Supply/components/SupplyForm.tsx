// src/pages/Supply/components/SupplyForm.tsx
import React from 'react';
import { Controller } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TextArea } from '@/components/ui/textarea';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useSupplyForm } from '@/pages/Supply/hooks';
import { SUPPLY_TYPES, UNIT_MEASURES } from '@/pages/Supply/types';

const SupplyForm: React.FC = () => {
  const {
    form,
    loading,
    error,
    isEditMode,
    onSubmit,
    handleCancel
  } = useSupplyForm();
  
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCancel} 
          className="mr-2"
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEditMode ? 'Editar Insumo' : 'Novo Insumo'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Insumo' : 'Novo Insumo'}</CardTitle>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Seção de Identificação */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-md">Identificação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome do Insumo */}
                <div className="md:col-span-2">
                  <Input
                    label="Nome *"
                    placeholder="Nome do insumo"
                    error={form.formState.errors.name?.message}
                    {...form.register('name')}
                  />
                </div>

                {/* Apelido */}
                <div>
                  <Input
                    label="Apelido"
                    placeholder="Apelido ou nome curto"
                    error={form.formState.errors.nick_name?.message}
                    {...form.register('nick_name')}
                  />
                </div>

                {/* Código EAN */}
                <div>
                  <Input
                    label="Código EAN"
                    placeholder="Código de barras EAN/UPC"
                    error={form.formState.errors.ean_code?.message}
                    {...form.register('ean_code')}
                  />
                </div>
              </div>
            </div>

            {/* Seção de Classificação */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-md">Classificação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de Insumo */}
                <div>
                  <Controller
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        label="Tipo *"
                        placeholder="Selecione um tipo"
                        options={SUPPLY_TYPES}
                        error={form.formState.errors.type?.message}
                        value={field.value}
                        onChange={(selected) => {
                          // Se o Select retorna o objeto inteiro {value, label}
                          if (typeof selected === 'object' && selected !== null && 'value' in selected) {
                            field.onChange(selected.value);
                          } 
                          // Se o Select retorna o evento do DOM
                          else if (selected && selected.target && 'value' in selected.target) {
                            field.onChange(selected.target.value);
                          }
                          // Se o Select retorna apenas o valor
                          else {
                            field.onChange(selected);
                          }
                        }}
                      />
                    )}
                  />
                </div>

                {/* Unidade de Medida */}
                <div>
                  <Controller
                    name="unit_measure"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        label="Unidade de Medida *"
                        placeholder="Selecione uma unidade"
                        options={UNIT_MEASURES}
                        error={form.formState.errors.unit_measure?.message}
                        value={field.value}
                        onChange={(selected) => {
                          // Se o Select retorna o objeto inteiro {value, label}
                          if (typeof selected === 'object' && selected !== null && 'value' in selected) {
                            field.onChange(selected.value);
                          } 
                          // Se o Select retorna o evento do DOM
                          else if (selected && selected.target && 'value' in selected.target) {
                            field.onChange(selected.target.value);
                          }
                          // Se o Select retorna apenas o valor
                          else {
                            field.onChange(selected);
                          }
                        }}
                      />
                    )}
                  />
                </div>

                {/* Descrição - Span 2 colunas */}
                <div className="md:col-span-2">
                  <TextArea
                    label="Descrição"
                    placeholder="Descrição detalhada do insumo"
                    error={form.formState.errors.description?.message}
                    {...form.register('description')}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2 border-t pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SupplyForm;