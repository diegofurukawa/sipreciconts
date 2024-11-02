// src/components/LayoutWrapper/index.tsx
import React, { Suspense } from 'react';
import { MainLayout } from '../../layouts/MainLayout';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => (
  <MainLayout>
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      }>
        {children}
      </Suspense>
    </div>
  </MainLayout>
);