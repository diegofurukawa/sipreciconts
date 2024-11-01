// src/layouts/MainLayout/index.tsx
import React from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Adicionando ambas as exportações para maior flexibilidade
export { MainLayout };
export default MainLayout;