// src/routes/modules/cadastros.routes.tsx
import { lazy } from 'react';
import type { AppRouteObject } from '../types';

// Lazy imports para otimização de carregamento
const CustomerPage = lazy(() => import('@/pages/Customer'));
const CustomerList = lazy(() => import('@/pages/Customer/List'));
const CustomerForm = lazy(() => import('@/pages/Customer/Form'));
const CustomerImport = lazy(() => import('@/pages/Customer/Import'));
const CustomerDetails = lazy(() => import('@/pages/Customer/Details'));

const CompanyPage = lazy(() => import('@/pages/Company'));
const CompanyList = lazy(() => import('@/pages/Company/List'));
const CompanyForm = lazy(() => import('@/pages/Company/Form'));
const CompanyDetails = lazy(() => import('@/pages/Company/Details'));

const TaxPage = lazy(() => import('@/pages/Tax'));
const TaxList = lazy(() => import('@/pages/Tax/List'));
const TaxForm = lazy(() => import('@/pages/Tax/Form'));
const TaxDetails = lazy(() => import('@/pages/Tax/Details'));

const SupplyPage = lazy(() => import('@/pages/Supply'));
const SupplyList = lazy(() => import('@/pages/Supply/List'));
const SupplyForm = lazy(() => import('@/pages/Supply/Form'));
const SupplyDetails = lazy(() => import('@/pages/Supply/Details'));
const SupplyCategories = lazy(() => import('@/pages/Supply/Categories'));

export const cadastrosRoutes: AppRouteObject[] = [
  // Rotas de Empresa
  {
    path: '/cadastros/empresa',
    element: <CompanyList />,
    title: 'Empresa'
  },
  {
    path: '/cadastros/empresa/novo',
    element: <CompanyForm />,
    title: 'Nova Empresa'
  },
  {
    path: '/cadastros/empresa/:id/editar',
    element: <CompanyForm />,
    title: 'Editar Empresa'
  },
  {
    path: '/cadastros/empresa/:id',
    element: <CompanyDetails />,
    title: 'Detalhes da Empresa'
  },

  // Rotas de Cliente
  {
    path: '/cadastros/clientes',
    element: <CustomerPage />,
    title: 'Clientes'
  },
  // {
  //   path: '/cadastros/clientes/novo',
  //   element: <CustomerForm />,
  //   title: 'Novo Cliente'
  // },
  // {
  //   path: '/cadastros/clientes/:id/editar',
  //   element: <CustomerForm />,
  //   title: 'Editar Cliente'
  // },
  // {
  //   path: '/cadastros/clientes/:id',
  //   element: <CustomerDetails />,
  //   title: 'Detalhes do Cliente'
  // },
  // {
  //   path: '/cadastros/clientes/importar',
  //   element: <CustomerImport />,
  //   title: 'Importar Clientes'
  // },

  // Rotas de Impostos
  {
    path: '/cadastros/impostos',
    element: <TaxList />,
    title: 'Impostos'
  },
  {
    path: '/cadastros/impostos/novo',
    element: <TaxForm />,
    title: 'Novo Imposto'
  },
  {
    path: '/cadastros/impostos/:id/editar',
    element: <TaxForm />,
    title: 'Editar Imposto'
  },
  {
    path: '/cadastros/impostos/:id',
    element: <TaxDetails />,
    title: 'Detalhes do Imposto'
  },

  // Rotas de Insumos
  {
    path: '/cadastros/insumos',
    element: <SupplyList />,
    title: 'Insumos'
  },
  {
    path: '/cadastros/insumos/novo',
    element: <SupplyForm />,
    title: 'Novo Insumo'
  },
  {
    path: '/cadastros/insumos/:id/editar',
    element: <SupplyForm />,
    title: 'Editar Insumo'
  },
  {
    path: '/cadastros/insumos/:id',
    element: <SupplyDetails />,
    title: 'Detalhes do Insumo'
  },
  {
    path: '/cadastros/insumos/categorias',
    element: <SupplyCategories />,
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
  CLIENTES: {
    ROOT: '/cadastros/clientes',
    NEW: '/cadastros/clientes/novo',
    EDIT: (id: string | number) => `/cadastros/clientes/${id}/editar`,
    DETAILS: (id: string | number) => `/cadastros/clientes/${id}`,
    IMPORT: '/cadastros/clientes/importar',
  },
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