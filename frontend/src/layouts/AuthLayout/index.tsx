// src/layouts/AuthLayout/index.tsx
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};