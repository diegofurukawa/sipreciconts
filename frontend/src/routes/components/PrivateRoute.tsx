// src/routes/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from './PageLoader';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
