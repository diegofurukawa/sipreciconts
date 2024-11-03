// src/routes/index.tsx
import { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/layouts/MainLayout';

// Import direto das páginas principais usando named imports
import { LoginPage } from '@/pages/Login';
import { HomePage } from '@/pages/Home';
import { NotFoundPage } from '@/pages/NotFound';

// Import das rotas de módulos
import { cadastrosRoutes } from './modules/cadastros.routes';
import { comercialRoutes } from './modules/comercial.routes';

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
  </div>
);

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

interface RouteConfig {
  path: string;
  Component: React.ComponentType;
  title?: string;
}

const renderModuleRoutes = (routes: RouteConfig[]) => {
  return routes.map(({ path, Component, title }) => {
    if (!Component) {
      console.warn(`No component provided for route: ${path}`);
      return null;
    }

    return (
      <Route
        key={path}
        path={path}
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Component />
          </Suspense>
        }
      />
    );
  }).filter(Boolean);
};

export const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rota pública */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Rota principal */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      {/* Rotas de cadastros */}
      <Route 
        path="/cadastros/*" 
        element={
          <PrivateRoute>
            <Routes>
              {renderModuleRoutes(cadastrosRoutes)}
            </Routes>
          </PrivateRoute>
        }
      />

      {/* Rotas comerciais */}
      <Route 
        path="/comercial/*" 
        element={
          <PrivateRoute>
            <Routes>
              {renderModuleRoutes(comercialRoutes)}
            </Routes>
          </PrivateRoute>
        }
      />

      {/* Rota 404 */}
      <Route 
        path="*" 
        element={<NotFoundPage />} 
      />
    </Routes>
  );
};

export default AppRoutes;