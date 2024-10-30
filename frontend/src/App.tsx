// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import CustomerList from './components/Customer/CustomerList';
import TaxList from './components/Tax/TaxList';
import SupplyList from './components/Supply/SupplyList';
import { MainLayout } from './layouts/MainLayout';

// Placeholder components for routes that don't exist yet
const TaxesPage = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Cadastro de Impostos</h1>
        <p>Esta funcionalidade está em desenvolvimento.</p>
      </div>
    </div>
  </MainLayout>
);

const CompanyPage = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Cadastro de Empresa</h1>
        <p>Esta funcionalidade está em desenvolvimento.</p>
      </div>
    </div>
  </MainLayout>
);

const SuppliesPage = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <SupplyList />
      </div>
    </div>
  </MainLayout>
);

const QuotationPage = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Orçamentos</h1>
        <p>Esta funcionalidade está em desenvolvimento.</p>
      </div>
    </div>
  </MainLayout>
);

const ContractsPage = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Contratos</h1>
        <p>Esta funcionalidade está em desenvolvimento.</p>
      </div>
    </div>
  </MainLayout>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />

          {/* Cadastros routes */}
          <Route path="/cadastros">
            <Route path="empresa" element={
              <PrivateRoute>
                <CompanyPage />
              </PrivateRoute>
            } />
            <Route path="clientes" element={
              <PrivateRoute>
                <CustomerList />
              </PrivateRoute>
            } />
            <Route path="impostos" element={
              <PrivateRoute>
                <TaxList />
              </PrivateRoute>
            } />
            <Route path="insumos" element={
              <PrivateRoute>
                <SuppliesPage />
              </PrivateRoute>
            } />
          </Route>

          {/* Comercial routes */}
          <Route path="/comercial">
            <Route path="orcamento" element={
              <PrivateRoute>
                <QuotationPage />
              </PrivateRoute>
            } />
            <Route path="contratos" element={
              <PrivateRoute>
                <ContractsPage />
              </PrivateRoute>
            } />
          </Route>

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;