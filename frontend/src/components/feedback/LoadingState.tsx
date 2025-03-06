// src/components/feedback/LoadingState.tsx
import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  pageId?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Carregando...',
  size = 'medium',
  className = ''
}) => {
  // Ajustar tamanho do spinner conforme a prop size
  const spinnerSizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  // Ajustar tamanho do texto conforme a prop size
  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-emerald-600 ${spinnerSizes[size]}`}></div>
      <p className={`mt-4 text-gray-600 ${textSizes[size]}`}>{message}</p>
    </div>
  );
};

export default LoadingState;