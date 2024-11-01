// src/routes/components/LayoutWrapper.tsx
import React, { Suspense } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageLoader } from './PageLoader';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => (
  <MainLayout>
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </div>
  </MainLayout>
);
