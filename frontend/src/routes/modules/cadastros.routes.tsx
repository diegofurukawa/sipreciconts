// src/routes/modules/cadastros.routes.tsx
import { lazy } from 'react';
import type { AppRouteObject } from '../types';

// const CustomerList = lazy(() => import('../../components/Customer/CustomerList'));
// const TaxList = lazy(() => import('../../components/Tax/TaxList'));
// const SupplyList = lazy(() => import('../../components/Supply/SupplyList'));

// Importando da nova estrutura de Company
const Company = lazy(() => import('../../pages/Company').then(m => ({ default: m.Company })));

export const cadastrosRoutes: AppRouteObject[] = [
  // {
  //   path: 'clientes',
  //   element: <CustomerList />,
  //   title: 'Clientes'
  // },
  {
    path: 'empresa',
    element: <Company />,
    title: 'Empresa'
  },
  {
    path: 'empresa/nova',
    element: <Company />,
    title: 'Nova Empresa'
  },
  {
    path: 'empresa/:id',
    element: <Company />,
    title: 'Editar Empresa'
  }
  // ,
  // {
  //   path: 'impostos',
  //   element: <TaxList />,
  //   title: 'Impostos'
  // },
  // {
  //   path: 'insumos',
  //   element: <SupplyList />,
  //   title: 'Insumos'
  // }
];