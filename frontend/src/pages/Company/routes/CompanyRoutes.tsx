// src/pages/Company/routes/CompanyRoutes.tsx
import { lazy } from 'react';
import type { AppRouteObject } from '@/types/routes.types';

// Lazy imports sem exportações nomeadas (simplificado para evitar erros)
const CompanyPage = lazy(() => import('@/pages/Company'));
const CompanyList = lazy(() => import('@/pages/Company/components/CompanyList'));
const CompanyForm = lazy(() => import('@/pages/Company/components/CompanyForm'));

// Tipos separados primeiro
export interface CompanyRouteConfig {
  ROOT: string;
  NEW: string;
  EDIT: (id: string | number) => string;
  DETAILS: (id: string | number) => string;
  IMPORT: string;
}

// Constantes de rotas do módulo
export const COMPANY_ROUTES = {
  ROOT: '/cadastros/empresa',
  NEW: '/cadastros/empresa/novo',
  EDIT: (id: string | number) => `/cadastros/empresa/${id}/editar`,
  DETAILS: (id: string | number) => `/cadastros/empresa/${id}`,
  IMPORT: '/cadastros/empresa/importar',
} as const;

// Configuração de rotas do módulo
const companyRoutes: AppRouteObject = {
  path: 'empresa',
  element: <CompanyPage />,
  title: 'Empresas',
  children: [
    {
      path: '',
      element: <CompanyList />,
      title: 'Lista de Empresas'
    },
    {
      path: 'novo',
      element: <CompanyForm />,
      title: 'Nova Empresa'
    },
    {
      path: ':id/editar',
      element: <CompanyForm />,
      title: 'Editar Empresa'
    }
  ]
};

// Exportação nomeada das rotas
export { companyRoutes };

// Exportação default para compatibilidade
export default companyRoutes;