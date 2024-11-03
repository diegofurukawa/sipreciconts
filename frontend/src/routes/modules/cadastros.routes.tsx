// src/routes/modules/cadastros.routes.ts
import { lazy } from 'react';
import type { AppRouteObject } from '../types';

// Lazy imports
const CustomerList = lazy(() => import('@/pages/Customer/List'));
const CustomerForm = lazy(() => import('@/pages/Customer/Form'));
const CompanyForm = lazy(() => import('@/pages/Company/Form'));

const Customer = lazy(() => import('@/pages/Customer').then(m => ({ default: m.Customer })));
const Company = lazy(() => import('@/pages/Company').then(m => ({ default: m.Company })));
const Tax = lazy(() => import('@/pages/Tax').then(m => ({ default: m.Tax })));
const Supply = lazy(() => import('@/pages/Supply').then(m => ({ default: m.Supply })));

export const cadastrosRoutes: AppRouteObject[] = [
  // Rotas de Empresa
  {
    path: 'empresa',
    element: <Company />,
    title: 'Empresa'
  },
  {
    path: 'empresa/novo',
    element: <Company />,
    title: 'Nova Empresa'
  },
  {
    path: 'empresa/:id',
    element: <Company />,
    title: 'Editar Empresa'
  },
  {
    path: 'empresa/:id/detalhes',
    element: <Company />,
    title: 'Detalhes da Empresa'
  },

  // Rotas de Cliente
  {
    path: 'clientes',
    element: <Customer />,
    title: 'Clientes'
  },
  {
    path: 'clientes/novo',
    element: <CustomerList />,
    title: 'Novo Cliente'
  },
  {
    path: 'clientes/:id',
    element: <Customer />,
    title: 'Editar Cliente'
  },
  {
    path: 'clientes/:id/detalhes',
    element: <Customer />,
    title: 'Detalhes do Cliente'
  },
  {
    path: 'clientes/importar',
    element: <Customer />,
    title: 'Importar Clientes'
  },

  // Rotas de Impostos
  {
    path: 'impostos',
    element: <Tax />,
    title: 'Impostos'
  },
  {
    path: 'impostos/novo',
    element: <Tax />,
    title: 'Novo Imposto'
  },
  {
    path: 'impostos/:id',
    element: <Tax />,
    title: 'Editar Imposto'
  },
  {
    path: 'impostos/:id/detalhes',
    element: <Tax />,
    title: 'Detalhes do Imposto'
  },

  // Rotas de Insumos
  {
    path: 'insumos',
    element: <Supply />,
    title: 'Insumos'
  },
  {
    path: 'insumos/novo',
    element: <Supply />,
    title: 'Novo Insumo'
  },
  {
    path: 'insumos/:id',
    element: <Supply />,
    title: 'Editar Insumo'
  },
  {
    path: 'insumos/:id/detalhes',
    element: <Supply />,
    title: 'Detalhes do Insumo'
  },
  {
    path: 'insumos/categorias',
    element: <Supply />,
    title: 'Categorias de Insumos'
  },
];