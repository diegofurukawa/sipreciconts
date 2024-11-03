// src/pages/Company/index.tsx
import { useLocation } from 'react-router-dom';
import { CompanyHeader } from './components/CompanyHeader';
import { CompanyList } from './components/CompanyList';
import { CompanyForm } from './components/CompanyForm';

export const CompanyPage = () => {
  const location = useLocation();
  const isForm = location.pathname.includes('/nova') || location.pathname.includes('/editar');

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isForm ? <CompanyForm /> : <CompanyList />}
      </div>
    </div>
  );
};

export { CompanyPage as Company };