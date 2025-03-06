// src/pages/UserProfile/routes.tsx
import { lazy } from 'react';
import type { AppRouteObject } from '@/types/routes.types';

// Lazy-loaded components
const UserProfilePage = lazy(() => import('@/pages/UserProfile'));
const SessionInfoPage = lazy(() => import('@/pages/UserProfile/SessionInfoPage'));

// Rotas do módulo de perfil de usuário
export const userProfileRoutes: AppRouteObject[] = [
  {
    path: 'perfil',
    element: <UserProfilePage />,
    title: 'Perfil do Usuário'
  },
  {
    path: 'perfil/session',
    element: <SessionInfoPage />,
    title: 'Detalhes da Sessão'
  }
];

// Constantes para uso em links de navegação
export const USER_PROFILE_ROUTES = {
  ROOT: '/perfil',
  SESSION: '/perfil/session',
} as const;

// Tipos para as rotas
export type UserProfileRoutesType = typeof USER_PROFILE_ROUTES;