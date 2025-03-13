// src/pages/SuppliesPriceList/routes/SuppliesPriceListRoutes.tsx
import React from 'react';
import type { AppRouteObject } from '@/types/routes.types';
import { lazyImportDefault } from '@/utils/lazyImport';

// Lazy imports with utility
const SuppliesPriceListList = lazyImportDefault(() => import('@/pages/SuppliesPriceList/components/SuppliesPriceListList'));
const SuppliesPriceListForm = lazyImportDefault(() => import('@/pages/SuppliesPriceList/components/SuppliesPriceListForm'));

export const suppliesPriceListRoutes: AppRouteObject[] = [
  {
    path: 'lista-precos',
    element: <SuppliesPriceListList />,
    title: 'Lista de Preços de Insumos'
  },
  {
    path: 'lista-precos/novo',
    element: <SuppliesPriceListForm />,
    title: 'Novo Preço de Insumo'
  },
  {
    path: 'lista-precos/:id/editar',
    element: <SuppliesPriceListForm />,
    title: 'Editar Preço de Insumo'
  }
];

// Route constants for navigation and links
export const SUPPLIES_PRICE_LIST_ROUTES = {
  ROOT: '/cadastros/lista-precos',
  NEW: '/cadastros/lista-precos/novo',
  EDIT: (id: string | number) => `/cadastros/lista-precos/${id}/editar`,
  DETAILS: (id: string | number) => `/cadastros/lista-precos/${id}`,
} as const;

// Type for routes
export type SuppliesPriceListRoutesType = typeof SUPPLIES_PRICE_LIST_ROUTES;