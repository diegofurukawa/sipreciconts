// src/pages/Customer/index.tsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary/index';
import { LoadingState } from '@/components/feedback/LoadingState';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerImport from './components/CustomerImport';

const Customer = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route index element={<CustomerList />} />
          <Route path="novo" element={<CustomerForm />} />
          <Route path=":id/editar" element={<CustomerForm />} />
          <Route path="importar" element={<CustomerImport />} />
          <Route path="*" element={<Navigate to="/cadastros/clientes" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Customer;