// src/layouts/MainLayout/index.tsx
import { ReactNode } from 'react';
import { MainLayoutNavbar as Navbar } from './components/MainLayoutNavbar';
import { Footer } from './components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
export {
  MainLayout
}