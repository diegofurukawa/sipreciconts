// src/pages/Company/index.tsx
import { MainLayout } from '../../layouts/MainLayout';
import { CompanyHeader } from './components/CompanyHeader';
import { CompanyList } from './components/CompanyList';
import { CompanyForm } from './components/CompanyForm';
import { useLocation } from 'react-router-dom';

export const CompanyPage = () => {
  const location = useLocation();
  const isForm = location.pathname.includes('/nova') || location.pathname.includes('/editar');

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <CompanyHeader />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {isForm ? <CompanyForm /> : <CompanyList />}
        </main>
      </div>
    </MainLayout>
  );
};

export { CompanyPage as Company };