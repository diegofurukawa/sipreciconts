// src/pages/User/routes/UserRoutes.tsx
import React from 'react';
import type { AppRouteObject } from '@/types/routes.types';
import { lazyImportDefault } from '@/utils/lazyImport';

// Importações lazy com o utilitário
const UserList = lazyImportDefault(() => import('@/pages/User/components/UserList'));
const UserForm = lazyImportDefault(() => import('@/pages/User/components/UserForm'));

export const userRoutes: AppRouteObject[] = [
  {
    path: 'usuarios',
    element: <UserList />,
    title: 'Usuários'
  },
  {
    path: 'usuarios/novo',
    element: <UserForm />,
    title: 'Novo Usuário'
  },
  {
    path: 'usuarios/:id/editar',
    element: <UserForm />,
    title: 'Editar Usuário'
  }
];

// Constantes de rotas para uso em links e navegação
export const USER_ROUTES = {
  ROOT: '/cadastros/usuarios',
  NEW: '/cadastros/usuarios/novo',
  EDIT: (id: string | number) => `/cadastros/usuarios/${id}/editar`,
  DETAILS: (id: string | number) => `/cadastros/usuarios/${id}`,
} as const;

// Tipos para as rotas
export type UserRoutesType = typeof USER_ROUTES;