// src/routes/modules/comercial.routes.tsx
import { Route } from 'react-router-dom';
import { lazy } from 'react';
import type { AppRouteObject } from '../../types/routes.types';

const QuoteList = lazy(() => import('@/pages/Quote/QuoteList'));
const ContractList = lazy(() => import('@/pages/Contract/ContractList'));

const comercialRoutes: AppRouteObject[] = [
  {
    path: 'orcamentos',
    element: <QuoteList />,
    title: 'Orçamentos'
  },
  {
    path: 'contratos',
    element: <ContractList />,
    title: 'Contratos'
  }
];

export {
  comercialRoutes
};