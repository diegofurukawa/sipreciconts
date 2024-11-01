// src/routes/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutWrapper } from '../components/LayoutWrapper';

// Pages
import LoginPage from '../pages/Login';
import HomePage from '../pages/Home';
import NotFoundPage from '../pages/NotFound';
import SuppliesPage from '../pages/Supplies';
import HelpPage from '../pages/Help';

// Módulos de Rotas
import { cadastrosRoutes } from './modules/cadastros.routes';
import { comercialRoutes } from './modules/comercial.routes';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  // Função para verificar autenticação e redirecionar
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <LayoutWrapper>{children}</LayoutWrapper>;
  };

  // Função para redirecionar usuário logado da página de login
  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  };

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Rotas Privadas */}
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
            <Routes>{cadastrosRoutes}</Routes>
          </PrivateRoute>
        }
      />

      {/* Módulo Comercial */}
      <Route
        path="/comercial/*"
        element={
          <PrivateRoute>
            <Routes>{comercialRoutes}</Routes>
          </PrivateRoute>
        }
      />

      {/* Outras Rotas Privadas */}
      <Route
        path="/suprimentos"
        element={
          <PrivateRoute>
            <SuppliesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/ajuda"
        element={
          <PrivateRoute>
            <HelpPage />
          </PrivateRoute>
        }
      />

      {/* Rota 404 */}
      <Route
        path="*"
        element={
          <PrivateRoute>
            <NotFoundPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;