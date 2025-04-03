// src/pages/SuppliesPriceList/components/SuppliesPriceListForm.tsx
import React, { useState, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { ArrowLeft, Info, Loader2 } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EnhancedSelect, SelectOption } from '@/components/ui/enhanced-select';
import { useSuppliesPriceListForm } from '@/pages/SuppliesPriceList/hooks';
import { formatValueAsCurrency, parseCurrencyValue } from '@/pages/SuppliesPriceList/utils';

// Componente de Input de Moeda
const CurrencyInput = ({
  value,
  onChange,
  onBlur,
  error,
  label,
  required = false
}: {
  value: string | number;
  onChange: (value: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  label: string;
  required?: boolean;
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mantém apenas números e vírgulas/pontos
    const rawValue = e.target.value.replace(/[^\d.,]/g, '');
    onChange(rawValue);
  };

  // Formata o valor para exibição
  const displayValue = typeof value === 'number' 
    ? formatValueAsCurrency(value) 
    : value;

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          R$
        </span>
        <input
          type="text"
          className={`w-full pl-8 pr-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-200'}`}
          placeholder="0,00"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={onBlur}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Componente Principal do Formulário
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
  
  // Funções para recarregar dados em caso de erro
  const reloadSupplies = useCallback(() => {
    window.location.reload(); // Recarrega a página como fallback
    // Idealmente, você chamaria uma função específica para recarregar apenas os insumos
  }, []);
  
  const reloadTaxes = useCallback(() => {
    window.location.reload(); // Recarrega a página como fallback
    // Idealmente, você chamaria uma função específica para recarregar apenas os impostos
  }, []);
  
  // Configuração para filtragem personalizada dos insumos
  const filterSupplies = useCallback((option: SelectOption, searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return (
      option.label.toLowerCase().includes(term) ||
      (option.secondaryLabel && option.secondaryLabel.toLowerCase().includes(term)) ||
      (option.badgeText && option.badgeText.toLowerCase().includes(term)) ||
      (option.description && option.description.toLowerCase().includes(term))
    );
  }, []);

  // Configuração para filtragem personalizada dos impostos
  const filterTaxes = useCallback((option: SelectOption, searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return (
      option.label.toLowerCase().includes(term) ||
      (option.secondaryLabel && option.secondaryLabel.toLowerCase().includes(term)) ||
      (option.badgeText && option.badgeText.toLowerCase().includes(term))
    );
  }, []);
  
  // Mostra estado de carregamento
  if (loading) {
    return <LoadingState />;
  }

  // Mostra estado de erro
  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Converter os insumos para o formato do EnhancedSelect
  const supplyOptions: SelectOption[] = supplies.map(supply => ({
    id: supply.id,
    label: supply.name,
    secondaryLabel: supply.unit_measure_display,
    badgeText: supply.type_display,
    badgeColor: 'bg-gray-100',
    description: `Tipo: ${supply.type_display}${supply.unit_measure_display ? ` • Unidade: ${supply.unit_measure_display}` : ''}`
  }));

  // Converter os impostos para o formato do EnhancedSelect
  const taxOptions: SelectOption[] = taxes.map(tax => ({
    id: tax.tax_id,
    label: tax.acronym,
    secondaryLabel: tax.group,
    badgeText: `${tax.value}${tax.calc_operator === '%' ? '%' : ''}`,
    badgeColor: 'bg-blue-100',
    description: `Grupo: ${tax.group}${tax.type ? ` • Tipo: ${tax.type}` : ''}`
  }));

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
              {/* Insumo - Usando o componente EnhancedSelect com carregamento incremental */}
              <div>
                <Controller
                  name="supply"
                  control={form.control}
                  render={({ field }) => (
                    <EnhancedSelect
                      options={supplyOptions}
                      value={field.value}
                      onChange={(value) => field.onChange(Number(value))}
                      isLoading={suppliesLoading}
                      error={form.formState.errors.supply?.message}
                      label="Insumo"
                      required={true}
                      placeholder="Selecione um insumo"
                      searchPlaceholder="Buscar insumos..."
                      noOptionsMessage="Nenhum insumo encontrado"
                      loadingMessage="Carregando insumos..."
                      errorMessage="Erro ao carregar insumos"
                      onRetry={reloadSupplies}
                      filterFunction={filterSupplies}
                      itemsPerPage={30} // Carregamento incremental com 10 itens por vez
                    />
                  )}
                />
              </div>

              {/* Imposto - Usando o componente EnhancedSelect com carregamento incremental */}
              <div>
                <Controller
                  name="tax"
                  control={form.control}
                  render={({ field }) => (
                    <EnhancedSelect
                      options={taxOptions}
                      value={field.value}
                      onChange={(value) => field.onChange(Number(value))}
                      isLoading={taxesLoading}
                      error={form.formState.errors.tax?.message}
                      label="Imposto"
                      required={true}
                      placeholder="Selecione um imposto"
                      searchPlaceholder="Buscar impostos..."
                      noOptionsMessage="Nenhum imposto encontrado"
                      loadingMessage="Carregando impostos..."
                      errorMessage="Erro ao carregar impostos"
                      onRetry={reloadTaxes}
                      filterFunction={filterTaxes}
                      itemsPerPage={30} // Carregamento incremental com 10 itens por vez
                    />
                  )}
                />
              </div>
            </div>

            {/* Valor e Sequência */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Valor - Usando componente de moeda */}
              <div>
                <Controller
                  name="value"
                  control={form.control}
                  render={({ field }) => (
                    <CurrencyInput
                      label="Valor"
                      required={true}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      onBlur={(e) => {
                        // Converte para número ao perder o foco
                        const value = parseCurrencyValue(e.target.value);
                        field.onChange(value);
                      }}
                      error={form.formState.errors.value?.message}
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
                    <div className="space-y-1">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Sequência
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        error={form.formState.errors.sequence?.message}
                        value={field.value || 0}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value) || 0);
                        }}
                        className="w-full"
                      />
                      <div className="flex items-start mt-1">
                        <Info className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
                        <p className="text-xs text-gray-500">
                          A sequência define a ordem de exibição dos preços
                        </p>
                      </div>
                    </div>
                  )}
                />
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
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SuppliesPriceListForm;