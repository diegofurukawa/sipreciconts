// src/pages/Company/index.tsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary/index';
import { LoadingState } from '@/components/feedback/LoadingState';
import CompanyList from './components/CompanyList';
import CompanyForm from './components/CompanyForm';

const Company = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route index element={<CompanyList />} />
          <Route path="novo" element={<CompanyForm />} />
          <Route path=":id/editar" element={<CompanyForm />} />
          <Route path="*" element={<Navigate to="/cadastros/empresa" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Company;