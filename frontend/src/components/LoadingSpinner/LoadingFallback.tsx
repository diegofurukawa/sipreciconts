// src/components/LoadingSpinner/LoadingFallback.tsx
import { LoadingSpinner } from './index';

interface LoadingFallbackProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingFallback = ({ 
  message = 'Carregando...', 
  fullScreen = false 
}: LoadingFallbackProps) => {
  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white z-50'
    : 'h-64';

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses}`}>
      <LoadingSpinner size={32} className="mb-2" />
      {message && (
        <p className="text-gray-600 text-sm">{message}</p>
      )}
    </div>
  );
};

export {
    LoadingFallback
};