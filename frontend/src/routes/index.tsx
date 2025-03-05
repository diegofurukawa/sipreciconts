// src/routes/index.tsx
import { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/auth/context/AuthContext";
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';

// Import direto das páginas principais usando named imports
import { LoginPage } from '@/pages/Auth';
import { HomePage } from '@/pages/Home';
import { NotFoundPage } from '@/pages/NotFound';

// Import das rotas de módulos
import { cadastrosRoutes } from './modules/cadastros.routes';
import { comercialRoutes } from './modules/comercial.routes';


// Componente de loading padrão
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
  </div>
);

// Tipos
interface RouteProps {
  children: React.ReactNode;
}

interface RouteConfig {
  path: string;
  element: React.ReactElement;
  title?: string;
  children?: RouteConfig[];
}

// Componente de rota privada
const PrivateRoute = ({ children }: RouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Componente de rota pública
const PublicRoute = ({ children }: RouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // Redireciona para a página inicial se já estiver autenticado
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <AuthLayout>{children}</AuthLayout>;
};

// Função para renderizar rotas de módulo
const renderModuleRoutes = (routes: RouteConfig[]) => {
  return routes.map((route) => {
    if (!route.element) {
      console.warn(`No element provided for route: ${route.path}`);
      return null;
    }

    // Se houver rotas filhas, renderiza recursivamente
    if (route.children && route.children.length > 0) {
      return (
        <Route key={route.path} path={route.path} element={route.element}>
          {renderModuleRoutes(route.children)}
        </Route>
      );
    }

    // Rota simples
    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Suspense fallback={<LoadingFallback />}>
            {route.element}
          </Suspense>
        }
      />
    );
  }).filter(Boolean); // Remove itens null/undefined
};

// Componente principal de rotas
export const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  // Loading inicial do auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rota de login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Rota inicial */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      {/* Módulo de Cadastros */}
      <Route
        path="/cadastros/*"
        element={
          <PrivateRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {cadastrosRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
            </Suspense>
          </PrivateRoute>
        }
      />

      {/* Módulo Comercial */}
      <Route
        path="/comercial/*"
        element={
          <PrivateRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {comercialRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
            </Suspense>
          </PrivateRoute>
        }
      />

      {/* Rota para página não encontrada */}
      <Route 
        path="*" 
        element={
          <AuthLayout>
            <NotFoundPage />
          </AuthLayout>
        } 
      />
    </Routes>
  );
};

// Exporta os tipos para uso em outros arquivos
export type { RouteConfig };

// Exporta o componente como default
export default AppRoutes;