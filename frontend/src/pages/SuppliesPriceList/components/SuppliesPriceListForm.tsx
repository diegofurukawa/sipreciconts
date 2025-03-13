// src/pages/SuppliesPriceList/components/SuppliesPriceListForm.tsx
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
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useSuppliesPriceListForm } from '@/pages/SuppliesPriceList/hooks';
import { formatValueAsCurrency, parseCurrencyValue } from '@/pages/SuppliesPriceList/utils';

const SuppliesPriceListForm: React.FC = () => {
  const {
    form,
    loading,
    submitting,
    error,
    isEditMode,
    supplies,
    taxes,
    suppliesLoading,
    taxesLoading,
    onSubmit,
    handleCancel
  } = useSuppliesPriceListForm();
  
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
          {isEditMode ? 'Editar Preço de Insumo' : 'Novo Preço de Insumo'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Preço de Insumo' : 'Novo Preço de Insumo'}</CardTitle>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Insumo e Imposto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Insumo */}
              <div>
                <Controller
                  name="supply"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      label="Insumo *"
                      placeholder="Selecione um insumo"
                      options={supplies.map(supply => ({
                        value: supply.id,
                        label: supply.name
                      }))}
                      error={form.formState.errors.supply?.message}
                      value={field.value}
                      isLoading={suppliesLoading}
                      onChange={(selected) => {
                        // Handle different Select component response formats
                        if (typeof selected === 'object' && selected !== null && 'value' in selected) {
                          field.onChange(Number(selected.value));
                        } else if (selected && selected.target && 'value' in selected.target) {
                          field.onChange(Number(selected.target.value));
                        } else {
                          field.onChange(Number(selected));
                        }
                      }}
                    />
                  )}
                />
              </div>

              {/* Imposto */}
              <div>
                <Controller
                  name="tax"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      label="Imposto *"
                      placeholder="Selecione um imposto"
                      options={taxes.map(tax => ({
                        value: tax.tax_id,
                        label: `${tax.acronym} (${tax.value}${tax.calc_operator === '%' ? '%' : ''})`
                      }))}
                      error={form.formState.errors.tax?.message}
                      value={field.value}
                      isLoading={taxesLoading}
                      onChange={(selected) => {
                        // Handle different Select component response formats
                        if (typeof selected === 'object' && selected !== null && 'value' in selected) {
                          field.onChange(Number(selected.value));
                        } else if (selected && selected.target && 'value' in selected.target) {
                          field.onChange(Number(selected.target.value));
                        } else {
                          field.onChange(Number(selected));
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>

            {/* Valor e Sequência */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Valor */}
              <div>
                <Controller
                  name="value"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      label="Valor *"
                      placeholder="R$ 0,00"
                      error={form.formState.errors.value?.message}
                      value={typeof field.value === 'number' 
                        ? formatValueAsCurrency(field.value) 
                        : field.value}
                      onChange={(e) => {
                        // Handle currency input
                        const formatted = e.target.value.replace(/[^\d.,]/g, '');
                        field.onChange(formatted);
                      }}
                      onBlur={(e) => {
                        // Convert to number on blur
                        const value = parseCurrencyValue(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </div>

              {/* Sequência */}
              <div>
                <Controller
                  name="sequence"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      label="Sequência"
                      type="number"
                      placeholder="0"
                      error={form.formState.errors.sequence?.message}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  )}
                />
                <p className="text-xs text-gray-500 mt-1">
                  A sequência define a ordem de exibição dos preços
                </p>
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
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SuppliesPriceListForm;