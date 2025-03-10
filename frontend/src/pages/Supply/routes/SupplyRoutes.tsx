// src/pages/Supply/routes/SupplyRoutes.tsx
import React from 'react';
import type { AppRouteObject } from '@/types/routes.types';
import { lazyImportDefault } from '@/utils/lazyImport';

// Importações lazy com o utilitário
const SupplyList = lazyImportDefault(() => import('@/pages/Supply/components/SupplyList'));
const SupplyForm = lazyImportDefault(() => import('@/pages/Supply/components/SupplyForm'));
const SupplyImport = lazyImportDefault(() => import('@/pages/Supply/components/SupplyImport'));

export const supplyRoutes: AppRouteObject[] = [
  {
    path: 'insumos',
    element: <SupplyList />,
    title: 'Insumos'
  },
  {
    path: 'insumos/novo',
    element: <SupplyForm />,
    title: 'Novo Insumo'
  },
  {
    path: 'insumos/:id/editar',
    element: <SupplyForm />,
    title: 'Editar Insumo'
  },
  {
    path: 'insumos/importar',
    element: <SupplyImport />,
    title: 'Importar Insumos'
  }
];

// Constantes de rotas para uso em links e navegação
export const SUPPLY_ROUTES = {
  ROOT: '/cadastros/insumos',
  NEW: '/cadastros/insumos/novo',
  EDIT: (id: string | number) => `/cadastros/insumos/${id}/editar`,
  DETAILS: (id: string | number) => `/cadastros/insumos/${id}`,
  IMPORT: '/cadastros/insumos/importar',
} as const;

// Tipos para as rotas
export type SupplyRoutesType = typeof SUPPLY_ROUTES;