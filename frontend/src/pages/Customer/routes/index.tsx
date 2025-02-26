// src/pages/Customer/routes/index.tsx
import { lazy } from 'react';
import { useParams } from 'react-router-dom';
import type { AppRouteObject } from '@/types/routes.types';

// Wrapper para CustomerDetails para passar customerId
const CustomerDetailsWrapper = () => {
  const { id } = useParams();
  return <CustomerDetails customerId={id!} />;
};

// Lazy imports com exportações nomeadas
const CustomerPage = lazy(() => import('../').then(module => ({ default: module.Customer })));
const CustomerList = lazy(() => import('../components/CustomerList').then(module => ({ default: module.CustomerList })));
const CustomerForm = lazy(() => import('../components/CustomerForm').then(module => ({ default: module.CustomerForm })));
const CustomerImport = lazy(() => import('../components/CustomerImport').then(module => ({ default: module.CustomerImport })));
const CustomerDetails = lazy(() => import('../components/CustomerDetails').then(module => ({ default: module.CustomerDetails })));

// Tipos separados primeiro
export interface CustomerRouteConfig {
  ROOT: string;
  NEW: string;
  EDIT: (id: string | number) => string;
  DETAILS: (id: string | number) => string;
  IMPORT: string;
}

// Constantes de rotas do módulo
export const CUSTOMER_ROUTES = {
  ROOT: '/cadastros/clientes',
  NEW: '/cadastros/clientes/novo',
  EDIT: (id: string | number) => `/cadastros/clientes/${id}/editar`,
  DETAILS: (id: string | number) => `/cadastros/clientes/${id}`,
  IMPORT: '/cadastros/clientes/importar',
} as const;

// Configuração de rotas do módulo
const customerRoutes: AppRouteObject = {
  path: 'clientes',
  element: <CustomerPage />,
  title: 'Clientes',
  children: [
    {
      path: '',
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
      element: <CustomerDetailsWrapper />,
      title: 'Detalhes do Cliente'
    },
    {
      path: 'importar',
      element: <CustomerImport />,
      title: 'Importar Clientes'
    }
  ]
};

// Exportação nomeada das rotas (removido export default)
export {
  customerRoutes
};