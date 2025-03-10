// src/routes/modules/cadastros.routes.tsx
import { lazy } from 'react';
import type { AppRouteObject } from '../../types/routes.types';

import { customerRoutes, CUSTOMER_ROUTES } from '@/pages/Customer/routes';
import { taxRoutes, TAX_ROUTES } from '@/pages/Tax/routes'; // Importando as novas rotas
import { companyRoutes, COMPANY_ROUTES } from '@/pages/Company/routes'; // Importando as novas rotas

// const SupplyPage = lazy(() => import('@/pages/Supply'));
const SupplyList = lazy(() => import('@/pages/Supply/components/SupplyList'));
// const SupplyForm = lazy(() => import('@/pages/Supply/components/SupplyForm'));

export const cadastrosRoutes: AppRouteObject[] = [

  //Rotas para Emrpesas
  companyRoutes,

  // Rotas de Cliente
  customerRoutes,

  // Rotas de Impostos
  ...taxRoutes, // Adicionando as rotas de impostos

  // Rotas de Insumos
  {
    path: 'insumos',
    element: <SupplyList />,
    title: 'Insumos'
  },
  // {
  //   path: 'insumos/novo',
  //   element: <SupplyForm />,
  //   title: 'Novo Insumo'
  // },
  // {
  //   path: 'insumos/:id/editar',
  //   element: <SupplyForm />,
  //   title: 'Editar Insumo'
  // },
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

  EMPRESA: COMPANY_ROUTES,
  
  CLIENTES: CUSTOMER_ROUTES,

  IMPOSTOS: TAX_ROUTES,

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