// src/pages/User/index.tsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary/index';
import { LoadingState } from '@/components/feedback/LoadingState';
import UserList from '@/pages/User/components/UserList';
import UserForm from '@/pages/User/components/UserForm';

const User = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route index element={<UserList />} />
          <Route path="novo" element={<UserForm />} />
          <Route path=":id/editar" element={<UserForm />} />
          <Route path="*" element={<Navigate to="/usuarios" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default User;