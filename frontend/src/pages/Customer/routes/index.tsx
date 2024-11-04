// src/pages/Customer/routes/index.tsx
import { lazy } from 'react';
import type { AppRouteObject } from '@/routes/types';

const CustomerPage = lazy(() => import('../'));
const CustomerList = lazy(() => import('../components/CustomerList'));
const CustomerForm = lazy(() => import('../components/CustomerForm'));
const CustomerImport = lazy(() => import('../components/CustomerImport'));
const CustomerDetails = lazy(() => import('../components/CustomerDetails'));

// Constantes de rotas do módulo
export const CUSTOMER_ROUTES = {
  ROOT: '/cadastros/clientes',
  NEW: '/cadastros/clientes/novo',
  EDIT: (id: string | number) => `/cadastros/clientes/${id}/editar`,
  DETAILS: (id: string | number) => `/cadastros/clientes/${id}`,
  IMPORT: '/cadastros/clientes/importar',
} as const;

// Configuração de rotas do módulo
export const customerRoutes: AppRouteObject = {
  path: 'clientes',
  element: <CustomerPage />,
  title: 'Clientes',
  children: [
    {
      index: true, // Importante: marca esta rota como a rota índice
      element: <CustomerList />,
      title: 'Lista de Clientes'
    },
    {
      path: 'novo',
      element: <CustomerForm />,
      title: 'Novo Cliente'
    },
    {
      path: ':id/editar',
      element: <CustomerForm />,
      title: 'Editar Cliente'
    },
    {
      path: ':id',
      element: <CustomerDetails />,
      title: 'Detalhes do Cliente'
    },
    {
      path: 'importar',
      element: <CustomerImport />,
      title: 'Importar Clientes'
    }
  ]
};