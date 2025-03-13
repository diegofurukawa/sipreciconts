// src/pages/SuppliesPriceList/utils/SuppliesPriceListValidators.ts
import * as z from 'zod';

export const suppliesPriceListFormSchema = z.object({
  supply: z.number({
    required_error: 'Insumo é obrigatório',
    invalid_type_error: 'Selecione um insumo válido'
  }),
  tax: z.number({
    required_error: 'Imposto é obrigatório',
    invalid_type_error: 'Selecione um imposto válido'
  }),
  value: z.union([
    z.number({
      required_error: 'Valor é obrigatório',
      invalid_type_error: 'Informe um valor válido'
    }),
    z.string().min(1, 'Valor é obrigatório').transform(val => {
      // Convert string to number, handling Brazilian currency format
      const normalizedValue = val.replace(/\./g, '').replace(',', '.');
      const parsed = parseFloat(normalizedValue);
      if (isNaN(parsed)) {
        throw new Error('Valor inválido');
      }
      return parsed;
    })
  ]),
  sequence: z.number().optional()
});

export type SuppliesPriceListFormSchema = z.infer<typeof suppliesPriceListFormSchema>;

/**
 * Format number as Brazilian currency for input display
 */
export const formatValueAsCurrency = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return '';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '';
  
  return numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Parse Brazilian currency format to number
 */
export const parseCurrencyValue = (value: string): number => {
  if (!value) return 0;
  const normalizedValue = value.replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : parsed;
};