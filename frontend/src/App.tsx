// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />

        {/* Cadastros routes */}
        <Route path="/cadastros">
          <Route path="empresa" element={<CompanyPage />} />
          <Route path="clientes" element={<CustomerList />} />
          <Route path="impostos" element={<TaxList />} />
          <Route path="insumos" element={<SuppliesPage />} />
        </Route>

        {/* Comercial routes */}
        <Route path="/comercial">
          <Route path="orcamento" element={<QuotationPage />} />
          <Route path="contratos" element={<ContractsPage />} />
        </Route>

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;