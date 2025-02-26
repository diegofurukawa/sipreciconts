// src/components/PrivateRoute/index.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
  </div>
);

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};