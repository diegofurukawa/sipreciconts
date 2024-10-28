import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CustomerList from './components/Customer/CustomerList';
import TaxList from './components/Tax/TaxList';

// Placeholder components for routes that don't exist yet
const TaxesPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Cadastro de Impostos</h1>
    <p>Esta funcionalidade está em desenvolvimento.</p>
  </div>
);

const CompanyPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Cadastro de Empresa</h1>
    <p>Esta funcionalidade está em desenvolvimento.</p>
</div>
);

const SuppliesPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Cadastro de Insumos</h1>
    <p>Esta funcionalidade está em desenvolvimento.</p>
  </div>
);

const QuotationPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Orçamentos</h1>
    <p>Esta funcionalidade está em desenvolvimento.</p>
  </div>
);

const ContractsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Contratos</h1>
    <p>Esta funcionalidade está em desenvolvimento.</p>
  </div>
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
          {/* <Route path="impostos" element={<TaxesPage />} /> */}
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