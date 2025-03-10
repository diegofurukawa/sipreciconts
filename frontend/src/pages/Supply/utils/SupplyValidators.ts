// src/pages/Supply/utils/validators.ts
import * as z from 'zod';

export const supplyFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  nick_name: z.string().optional(),
  ean_code: z.string().optional(),
  description: z.string().optional(),
  type: z.string().min(1, 'Tipo é obrigatório'),
  unit_measure: z.string().min(1, 'Unidade de medida é obrigatória')
});

export type SupplyFormSchema = z.infer<typeof supplyFormSchema>;

// Função para formatar código EAN
export const formatEAN = (value: string) => {
  // Remove caracteres não numéricos
  return value.replace(/\D/g, '');
};

// Função para validar código EAN
export const validateEAN = (value: string | undefined) => {
  if (!value) return true;
  const ean = formatEAN(value);
  
  // Verifica se o EAN tem 8, 12, 13 ou 14 dígitos
  return [8, 12, 13, 14].includes(ean.length);
};