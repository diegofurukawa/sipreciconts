// src/routes/modules/cadastros.routes.tsx
import { Route } from 'react-router-dom';
import { lazy } from 'react';
import type { AppRouteObject } from '../types';

const CustomerList = lazy(() => import('../../components/Customer/CustomerList'));
const CompanyList = lazy(() => import('../../components/Company/CompanyList'));
const TaxList = lazy(() => import('../../components/Tax/TaxList'));
const SupplyList = lazy(() => import('../../components/Supply/SupplyList'));

export const cadastrosRoutes: AppRouteObject[] = [
  {
    path: 'clientes',
    element: <CustomerList />,
    title: 'Clientes'
  },
  {
    path: 'empresas',
    element: <CompanyList />,
    title: 'Empresas'
  },
  {
    path: 'impostos',
    element: <TaxList />,
    title: 'Impostos'
  },
  {
    path: 'insumos',
    element: <SupplyList />,
    title: 'Insumos'
  }
];