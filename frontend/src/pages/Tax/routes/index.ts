// src/pages/Tax/routes/index.tsx
import { lazy } from 'react';
import type { AppRouteObject } from '../../../types/routes.types';

// Lazy loading dos componentes
const TaxPage = lazy(() => import('../index'));
const TaxForm = lazy(() => import('../components/TaxForm'));

// Rotas específicas para o módulo de impostos
export const taxRoutes: AppRouteObject[] = [
  {
    path: 'impostos',
    element: <TaxPage />,
    title: 'Impostos e Taxas'
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

// Constantes de rotas para uso em links
export const TAX_ROUTES = {
  ROOT: '/cadastros/impostos',
  NEW: '/cadastros/impostos/novo',
  EDIT: (id: string | number) => `/cadastros/impostos/${id}/editar`,
  DETAILS: (id: string | number) => `/cadastros/impostos/${id}`,
} as const;