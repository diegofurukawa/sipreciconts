// src/components/ErrorBoundary/LoadingFallback.tsx
import React from 'react';

interface LoadingFallbackProps {
  message?: string;
}

/**
 * Componente para exibir durante o carregamento em Suspense
 */
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = 'Carregando...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] w-full">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingFallback;