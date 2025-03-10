// src/pages/Customer/routes/CustomerRoutes.tsx
import React from 'react';
import type { AppRouteObject } from '@/types/routes.types';
import { lazyImportDefault } from '@/utils/lazyImport';

// Importações lazy com o utilitário
const CustomerList = lazyImportDefault(() => import('@/pages/Customer/components/CustomerList'));
const CustomerForm = lazyImportDefault(() => import('@/pages/Customer/components/CustomerForm'));
const CustomerImport = lazyImportDefault(() => import('@/pages/Customer/components/CustomerImport'));

export const customerRoutes: AppRouteObject[] = [
  {
    path: 'clientes',
    element: <CustomerList />,
    title: 'Clientes'
  },
  {
    path: 'clientes/novo',
    element: <CustomerForm />,
    title: 'Novo Cliente'
  },
  {
    path: 'clientes/:id/editar',
    element: <CustomerForm />,
    title: 'Editar Cliente'
  },
  {
    path: 'clientes/importar',
    element: <CustomerImport />,
    title: 'Importar Clientes'
  }
];

// Constantes de rotas para uso em links e navegação
export const CUSTOMER_ROUTES = {
  ROOT: '/cadastros/clientes',
  NEW: '/cadastros/clientes/novo',
  EDIT: (id: string | number) => `/cadastros/clientes/${id}/editar`,
  DETAILS: (id: string | number) => `/cadastros/clientes/${id}`,
  IMPORT: '/cadastros/clientes/importar',
} as const;

// Tipos para as rotas
export type CustomerRoutesType = typeof CUSTOMER_ROUTES;