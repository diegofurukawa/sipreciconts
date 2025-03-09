// src/pages/Company/index.tsx
import { Outlet, useLocation } from 'react-router-dom';
import { CompanyHeader } from './components/CompanyHeader';
import CompanyList from './components/CompanyList';
import { ErrorBoundary } from '@/components/ErrorBoundary/index';

const getPageTitle = (pathname: string) => {
  if (pathname.endsWith('/novo')) return 'Nova Empresa';
  if (pathname.includes('/editar')) return 'Editar Empresa';
  if (pathname.includes('/importar')) return 'Importar Empresas';
  return 'Empresas';
};

const Company = () => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  
  // Verifica se estamos na rota raiz de empresas
  const isRootPath = location.pathname === '/cadastros/empresa';
  
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <CompanyHeader title={title} />
        <div className="container mx-auto px-4 py-6">
          {isRootPath ? <CompanyList /> : <Outlet />}
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Exportação nomeada da função helper
export { getPageTitle };

// Exportação default do componente principal para uso nas rotas
export default Company;