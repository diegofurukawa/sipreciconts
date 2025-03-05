// src/auth/routes/auth_routes.ts
import { lazy } from 'react';
import type { AppRouteObject } from '@/types/routes.types';

// Lazy-loaded components
const LoginPage = lazy(() => import('@/pages/Auth'));
const ForgotPasswordPage = lazy(() => import('@/pages/Auth/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('@/pages/Auth/ResetPassword'));

export const AUTH_ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
};

export const authRoutes: AppRouteObject[] = [
  {
    path: AUTH_ROUTES.LOGIN,
    element: <LoginPage />,
    title: 'Login'
  },
  {
    path: AUTH_ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
    title: 'Esqueci minha senha'
  },
  {
    path: AUTH_ROUTES.RESET_PASSWORD,
    element: <ResetPasswordPage />,
    title: 'Redefinir senha'
  }
];

// Type safe route helpers
export const getLoginRoute = () => AUTH_ROUTES.LOGIN;
export const getForgotPasswordRoute = () => AUTH_ROUTES.FORGOT_PASSWORD;
export const getResetPasswordRoute = (token: string) => 
  AUTH_ROUTES.RESET_PASSWORD.replace(':token', token);