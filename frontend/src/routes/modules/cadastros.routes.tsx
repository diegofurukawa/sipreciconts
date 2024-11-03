// src/routes/modules/cadastros.routes.ts
import { lazy } from 'react';

// Lazy imports
const CustomerList = lazy(() => import('@/pages/Customer/List'));
const CustomerForm = lazy(() => import('@/pages/Customer/Form'));
const CompanyForm = lazy(() => import('@/pages/Company/Form'));

interface RouteConfig {
  path: string;
  Component: React.ComponentType;
  title: string;
}

const cadastrosRoutes: RouteConfig[] = [
  {
    path: 'clientes',
    Component: CustomerList,
    title: 'Lista de Clientes'
  },
  {
    path: 'clientes/novo',
    Component: CustomerForm,
    title: 'Novo Cliente'
  },
  {
    path: 'clientes/:id',
    Component: CustomerForm,
    title: 'Editar Cliente'
  },
  {
    path: 'empresa',
    Component: CompanyForm,
    title: 'Dados da Empresa'
  }
];

export {
  cadastrosRoutes
};