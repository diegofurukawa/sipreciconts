// src/providers/index.tsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "@/contexts/AuthContext";
import { CompanyProvider } from '@/contexts/CompanyContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CompanyProvider>
            {children}
          </CompanyProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default AppProviders;