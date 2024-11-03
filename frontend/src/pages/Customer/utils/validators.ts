import * as z from 'zod';

export const customerFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  document: z.string().optional(),
  customer_type: z.string().optional(),
  celphone: z.string().min(1, 'Celular é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().optional(),
  complement: z.string().optional(),
});

export type CustomerFormSchema = z.infer<typeof customerFormSchema>;