// src/routes/modules/customer.routes.tsx
import { lazy } from 'react';
import { Route } from 'react-router-dom';

const CustomerPage = lazy(() => import('@/pages/Customer'));
const CustomerList = lazy(() => import('@/pages/Customer/components/CustomerList'));
const CustomerForm = lazy(() => import('@/pages/Customer/components/CustomerForm'));
const CustomerImport = lazy(() => import('@/pages/Customer/components/CustomerImport'));
const CustomerDetails = lazy(() => import('@/pages/Customer/components/CustomerDetails'));

export const customerRoutes = [
  {
    path: 'clientes',
    element: <CustomerPage />,
    children: [
      {
        index: true,
        element: <CustomerList />,
      },
      {
        path: 'novo',
        element: <CustomerForm />,
      },
      {
        path: ':id/editar',
        element: <CustomerForm />,
      },
      {
        path: ':id',
        element: <CustomerDetails />,
      },
      {
        path: 'importar',
        element: <CustomerImport />,
      },
    ],
  },
];

// Constantes para uso em links e navegação
export const CUSTOMER_ROUTES = {
  ROOT: '/cadastros/clientes',
  NEW: '/cadastros/clientes/novo',
  EDIT: (id: string | number) => `/cadastros/clientes/${id}/editar`,
  DETAILS: (id: string | number) => `/cadastros/clientes/${id}`,
  IMPORT: '/cadastros/clientes/importar',
} as const;