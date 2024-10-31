// src/routes/index.tsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MainLayout } from '../layouts/MainLayout';

// Páginas públicas
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

// Páginas protegidas - Lazy loading para melhor performance
const Home = React.lazy(() => import('../pages/Home'));

// Cadastros
const CustomerList = React.lazy(() => import('../components/Customer/CustomerList'));
const CustomerForm = React.lazy(() => import('../components/Customer/CustomerForm'));
//const CompanyForm = React.lazy(() => import('../components/Company/CompanyForm'));
const TaxList = React.lazy(() => import('../components/Tax/TaxList'));
const TaxForm = React.lazy(() => import('../components/Tax/TaxForm'));
const SupplyList = React.lazy(() => import('../components/Supply/SupplyList'));
const SupplyForm = React.lazy(() => import('../components/Supply/SupplyForm'));

// Comercial
// const QuoteList = React.lazy(() => import('../components/Quote/QuoteList'));
// const QuoteForm = React.lazy(() => import('../components/Quote/QuoteForm'));
// const ContractList = React.lazy(() => import('../components/Contract/ContractList'));
// const ContractForm = React.lazy(() => import('../components/Contract/ContractForm'));

// Ajuda
// const Help = React.lazy(() => import('../pages/Help'));

// Loading Component
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
  </div>
);

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Wrapper para páginas com MainLayout
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MainLayout>
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </div>
  </MainLayout>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      {/* Home */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <LayoutWrapper>
              <Home />
            </LayoutWrapper>
          </PrivateRoute>
        }
      />

      {/* Cadastros Routes */}
      <Route path="/cadastros">
        {/* Empresa */}
        <Route
          path="empresa"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />

        {/* Clientes */}
        <Route
          path="clientes"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="clientes/novo"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="clientes/:id"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />

        {/* Impostos */}
        <Route
          path="impostos"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <TaxList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="impostos/novo"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="impostos/:id"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />

        {/* Insumos */}
        <Route
          path="insumos"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <SupplyList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="insumos/novo"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="insumos/:id"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
      </Route>

      {/* Comercial Routes */}
      <Route path="/comercial">
        {/* Orçamentos */}
        <Route
          path="orcamento"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="orcamento/novo"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="orcamento/:id"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />

        {/* Contratos */}
        <Route
          path="contratos"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="contratos/novo"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="contratos/:id"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <CustomerList />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
      </Route>

      {/* Ajuda Route */}
      <Route
        path="/ajuda"
        element={
          <PrivateRoute>
            <LayoutWrapper>
              <CustomerList />
            </LayoutWrapper>
          </PrivateRoute>
        }
      />

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;