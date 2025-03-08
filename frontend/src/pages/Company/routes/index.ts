// src/pages/Company/routes/index.ts
import { lazy } from 'react';
import type { AppRouteObject } from '@/types/routes.types';

// Lazy imports para otimização de carregamento
const CompanyList = lazy(() => import('@/pages/Company/components/CompanyList'));
const CompanyForm = lazy(() => import('@/pages/Company/components/CompanyForm'));

export const companyRoutes: AppRouteObject[] = [
  {
    path: 'empresa',
    element: <CompanyList />,
    title: 'Empresas'
  },
  {
    path: 'empresa/novo',
    element: <CompanyForm />,
    title: 'Nova Empresa'
  },
  {
    path: 'empresa/:id/editar',
    element: <CompanyForm />,
    title: 'Editar Empresa'
  }
];

// Constantes de rotas para uso em links e navegação
export const COMPANY_ROUTES = {
  ROOT: '/cadastros/empresa',
  NEW: '/cadastros/empresa/novo',
  EDIT: (id: string | number) => `/cadastros/empresa/${id}/editar/`,
  DETAILS: (id: string | number) => `/cadastros/empresa/${id}/`,
} as const;

// Tipos para as rotas
export type CompanyRoutesType = typeof COMPANY_ROUTES;