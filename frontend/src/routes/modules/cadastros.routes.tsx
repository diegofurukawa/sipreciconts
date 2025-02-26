// src/routes/modules/cadastros.routes.tsx
import { lazy } from 'react';
import type { AppRouteObject } from '../../types/routes.types';
import { customerRoutes, CUSTOMER_ROUTES } from '@/pages/Customer/routes';

// Lazy imports para otimização de carregamento
const CustomerPage = lazy(() => import('@/pages/Customer'));
const CustomerList = lazy(() => import('@/pages/Customer/components/CustomerList'));
const CustomerForm = lazy(() => import('@/pages/Customer/components/CustomerForm'));
const CustomerImport = lazy(() => import('@/pages/Customer/components/CustomerImport'));
const CustomerDetails = lazy(() => import('@/pages/Customer/components/CustomerDetails'));

// Fix: Correctly import Company components from the structure we have
const CompanyPage = lazy(() => import('@/pages/Company'));
const CompanyList = lazy(() => import('@/pages/Company/components/CompanyList'));
const CompanyForm = lazy(() => import('@/pages/Company/components/CompanyForm'));

const TaxPage = lazy(() => import('@/pages/Tax'));
const TaxList = lazy(() => import('@/pages/Tax'));

const SupplyPage = lazy(() => import('@/pages/Supply'));
const SupplyList = lazy(() => import('@/pages/Supply/components/SupplyList'));
const SupplyForm = lazy(() => import('@/pages/Supply/components/SupplyForm'));

export const cadastrosRoutes: AppRouteObject[] = [
  // Rotas de Empresa
  {
    path: 'empresa',
    element: <CompanyList />,
    title: 'Empresa'
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
  },
  {
    path: 'empresa/:id',
    element: <CompanyList />,  // Changed from CompanyDetails to CompanyList as we don't have a Details component yet
    title: 'Detalhes da Empresa'
  },

  // Rotas de Cliente
  customerRoutes,

  // Rotas de Impostos
  {
    path: 'impostos',
    element: <TaxList />,
    title: 'Impostos'
  },
  {
    path: 'impostos/novo',
    element: <TaxList />,
    title: 'Novo Imposto'
  },
  {
    path: 'impostos/:id/editar',
    element: <TaxList />,
    title: 'Editar Imposto'
  },
  {
    path: 'impostos/:id',
    element: <TaxList />,
    title: 'Detalhes do Imposto'
  },

  // Rotas de Insumos
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
    path: 'insumos/:id',
    element: <SupplyList />,
    title: 'Detalhes do Insumo'
  },
  {
    path: 'insumos/categorias',
    element: <SupplyList />,
    title: 'Categorias de Insumos'
  },
];

// Constantes de rotas para uso em links e navegação
export const CADASTROS_ROUTES = {
  EMPRESA: {
    ROOT: '/cadastros/empresa',
    NEW: '/cadastros/empresa/novo',
    EDIT: (id: string | number) => `/cadastros/empresa/${id}/editar`,
    DETAILS: (id: string | number) => `/cadastros/empresa/${id}`,
  },
  
  CLIENTES: CUSTOMER_ROUTES,

  IMPOSTOS: {
    ROOT: '/cadastros/impostos',
    NEW: '/cadastros/impostos/novo',
    EDIT: (id: string | number) => `/cadastros/impostos/${id}/editar`,
    DETAILS: (id: string | number) => `/cadastros/impostos/${id}`,
  },
  INSUMOS: {
    ROOT: '/cadastros/insumos',
    NEW: '/cadastros/insumos/novo',
    EDIT: (id: string | number) => `/cadastros/insumos/${id}/editar`,
    DETAILS: (id: string | number) => `/cadastros/insumos/${id}`,
    CATEGORIES: '/cadastros/insumos/categorias',
  },
} as const;

// Tipos para as rotas
export type CadastrosRoutesType = typeof CADASTROS_ROUTES;
export type CadastrosRoutePaths = {
  [K in keyof CadastrosRoutesType]: {
    [P in keyof CadastrosRoutesType[K]]: CadastrosRoutesType[K][P] extends Function
      ? ReturnType<CadastrosRoutesType[K][P]>
      : CadastrosRoutesType[K][P];
  };
};