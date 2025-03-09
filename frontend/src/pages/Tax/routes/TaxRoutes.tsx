// src/routes/modules/tax.routes.tsx
import React from 'react';
import type { AppRouteObject } from '@/types/routes.types';
import { lazyImportDefault } from '@/utils/lazyImport';

// Importações lazy com o utilitário
const TaxList = lazyImportDefault(() => import('@/pages/Tax/components/TaxList'));
const TaxForm = lazyImportDefault(() => import('@/pages/Tax/components/TaxForm'));

export const taxRoutes: AppRouteObject[] = [
  {
    path: 'impostos',
    element: <TaxList />,
    title: 'Impostos'
  },
  {
    path: 'impostos/novo',
    element: <TaxForm />,
    title: 'Novo Imposto'
  },
  {
    path: 'impostos/:id/editar',
    element: <TaxForm />,
    title: 'Editar Imposto'
  }
];

// Constantes de rotas para uso em links e navegação
export const TAX_ROUTES = {
  ROOT: '/cadastros/impostos',
  NEW: '/cadastros/impostos/novo',
  EDIT: (id: string | number) => `/cadastros/impostos/${id}/editar`,
  DETAILS: (id: string | number) => `/cadastros/impostos/${id}`,
} as const;

// Tipos para as rotas
export type TaxRoutesType = typeof TAX_ROUTES;