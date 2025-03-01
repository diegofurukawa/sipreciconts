// src/pages/Tax/index.tsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary/index';
import { LoadingState } from '@/components/feedback/LoadingState';
import TaxList from './components/TaxList';
import TaxForm from './components/TaxForm';

const Tax = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route index element={<TaxList />} />
          <Route path="novo" element={<TaxForm />} />
          <Route path=":id/editar" element={<TaxForm />} />
          <Route path="*" element={<Navigate to="/cadastros/impostos" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Tax;
