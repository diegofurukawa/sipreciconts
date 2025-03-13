// src/layouts/MainLayout/index.tsx
import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho */}
      <Header />
      
      {/* Conteúdo principal */}
      <main className="flex-grow px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Título da página */}
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>}
              {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
            </div>
          )}
          
          {/* Conteúdo da página */}
          {children}
        </div>
      </main>
      
      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default MainLayout;