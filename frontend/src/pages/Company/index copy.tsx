// src/pages/Company/index.tsx
import { Outlet, useLocation } from 'react-router-dom';
import { CompanyHeader } from './components/CompanyHeader';
import CompanyList from '@/pages/Company/components/CompanyList';
import { RouteDebug } from '@/components/RouteDebug';

const getPageTitle = (pathname: string) => {
  if (pathname.endsWith('/novo')) return 'Novo Empresa';
  if (pathname.includes('/editar')) return 'Editar Empresa';
  if (pathname.includes('/importar')) return 'Importar Empresa';
  return 'Empresas';
};

const Company = () => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  
  // Verifica se estamos na rota raiz de clientes
  const isRootPath = location.pathname === '/cadastros/empresa';
  
  return (
    <div className="space-y-6">
      <CompanyHeader title={title} />
      <div className="container mx-auto px-4 py-6">
        {isRootPath ? <CompanyList /> : <Outlet />}
      </div>
      <RouteDebug />
    </div>
  );
};

// Exportação nomeada da função helper (caso seja necessária em outros lugares)
export { getPageTitle };

// Exportação nomeada do componente principal
export {
  Company
};