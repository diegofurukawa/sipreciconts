// src/pages/SuppliesPriceList/index.tsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary/index';
import { LoadingState } from '@/components/feedback/LoadingState';
import { SuppliesPriceListList } from '@/pages/SuppliesPriceList/components';
import { SuppliesPriceListForm } from '@/pages/SuppliesPriceList/components';

const SuppliesPriceList = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route index element={<SuppliesPriceListList />} />
          <Route path="novo" element={<SuppliesPriceListForm />} />
          <Route path=":id/editar" element={<SuppliesPriceListForm />} />
          <Route path="*" element={<Navigate to="/cadastros/lista-precos" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default SuppliesPriceList;