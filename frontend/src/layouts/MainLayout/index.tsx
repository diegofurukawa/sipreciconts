// src/layouts/MainLayout/index.tsx
import { ReactNode } from 'react';
import { Header, Footer } from './components';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/routes/config/route-paths';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();

  // Redireciona para login se não houver usuário autenticado
  if (!user) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export {
  MainLayout
};