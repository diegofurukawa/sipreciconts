// src/routes/modules/cadastros.routes.tsx
import { lazy } from 'react';
import type { AppRouteObject } from '../../types/routes.types';

import { customerRoutes, CUSTOMER_ROUTES } from '@/pages/Customer/routes';
import { taxRoutes, TAX_ROUTES } from '@/pages/Tax/routes'; 
import { companyRoutes, COMPANY_ROUTES } from '@/pages/Company/routes';
import { supplyRoutes, SUPPLY_ROUTES } from '@/pages/Supply/routes';
import { userRoutes, USER_ROUTES } from '@/pages/User/routes';
import { suppliesPriceListRoutes, SUPPLIES_PRICE_LIST_ROUTES } from '@/pages/SuppliesPriceList/routes';

export const cadastrosRoutes: AppRouteObject[] = [
  //Rotas para Empresas
  ...companyRoutes,

  // Rotas de Cliente
  ...customerRoutes,

  // Rotas de Impostos
  ...taxRoutes,

  // Rotas de Insumos
  ...supplyRoutes,
  
  // Rotas de Lista de Preços de Insumos
  ...suppliesPriceListRoutes,
  
  // Rotas de Usuários
  ...userRoutes
];

// Constantes de rotas para uso em links e navegação
export const CADASTROS_ROUTES = {
  EMPRESA: COMPANY_ROUTES,
  
  CLIENTES: CUSTOMER_ROUTES,

  IMPOSTOS: TAX_ROUTES,

  INSUMOS: SUPPLY_ROUTES,
  
  LISTA_PRECOS: SUPPLIES_PRICE_LIST_ROUTES,
  
  USUARIOS: USER_ROUTES
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