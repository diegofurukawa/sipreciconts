// src/routes/index.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { AppRouteObject } from './types';
import { cadastrosRoutes, comercialRoutes } from './modules';

// Lazy loading das páginas
const LoginPage = lazy(() => import('../pages/Login'));
const HomePage = lazy(() => import('../pages/Home'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
  </div>
);

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // Removido o LayoutWrapper daqui
};

export const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            {isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
          </Suspense>
        } 
      />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Suspense fallback={<LoadingFallback />}>
              <HomePage />
            </Suspense>
          </PrivateRoute>
        }
      />

      <Route
        path="/cadastros/*"
        element={
          <PrivateRoute>
            <Routes>
              {cadastrosRoutes.map(({ path, element, title }) => (
                <Route 
                  key={path} 
                  path={path} 
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      {element}
                    </Suspense>
                  } 
                />
              ))}
            </Routes>
          </PrivateRoute>
        }
      />

      <Route
        path="/comercial/*"
        element={
          <PrivateRoute>
            <Routes>
              {comercialRoutes.map(({ path, element, title }) => (
                <Route 
                  key={path} 
                  path={path} 
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      {element}
                    </Suspense>
                  } 
                />
              ))}
            </Routes>
          </PrivateRoute>
        }
      />

      <Route 
        path="*" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        } 
      />
    </Routes>
  );
};
