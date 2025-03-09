import { lazy } from 'react';
import type { AppRouteObject } from '@/types/routes.types';

// Lazy imports com exportações nomeadas
const CompanyPage = lazy(() => import('@/pages/Company').then(module => ({ default: module.Company })));
const CompanyList = lazy(() => import('@/pages/Company/components').then(module => ({ default: module.CompanyList })));
const CompanyForm = lazy(() => import('@/pages/Company/components').then(module => ({ default: module.CompanyForm })));


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
  path: 'company',
  element: <CompanyPage />,
  title: 'company',
  children: [
    {
      path: '',
      element: <CompanyList />,
      title: 'Lista de company'
    },
    {
      path: 'novo',
      element: <CompanyForm />,
      title: 'Novo Cliente'
    },
    {
      path: ':id/editar',
      element: <CompanyForm />,
      title: 'Editar Cliente'
    }
  ]
};

// Exportação nomeada das rotas (removido export default)
export {
  companyRoutes
};