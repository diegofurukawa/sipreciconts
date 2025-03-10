// src/pages/Supply/index.tsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary/index';
import { LoadingState } from '@/components/feedback/LoadingState';
import { SupplyList } from '@/pages/Supply/components';
import { SupplyForm } from '@/pages/Supply/components';
import { SupplyImport } from '@/pages/Supply/components';

const Supply = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route index element={<SupplyList />} />
          <Route path="novo" element={<SupplyForm />} />
          <Route path=":id/editar" element={<SupplyForm />} />
          <Route path="importar" element={<SupplyImport />} />
          <Route path="*" element={<Navigate to="/cadastros/insumos" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Supply;