// src/routes/modules/comercial.routes.tsx
import { Route } from 'react-router-dom';
import { lazy } from 'react';
import type { AppRouteObject } from '../types';

const QuoteList = lazy(() => import('../../components/Quote/QuoteList'));
const ContractList = lazy(() => import('../../components/Contract/ContractList'));

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