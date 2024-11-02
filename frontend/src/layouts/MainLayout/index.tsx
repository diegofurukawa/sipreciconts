// src/layouts/MainLayout/index.tsx
import React from 'react';
import { MainLayoutNavbar } from './components/MainLayoutNavbar';
import { Footer } from './components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainLayoutNavbar />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export {
  MainLayout
}