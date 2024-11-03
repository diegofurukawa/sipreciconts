// src/components/LoadingSpinner/index.tsx
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner = ({ size = 24, className = '' }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 
        size={size} 
        className={`animate-spin text-emerald-600 ${className}`}
      />
    </div>
  );
};

export {
    LoadingSpinner
};