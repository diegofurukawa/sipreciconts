// src/pages/Customer/index.tsx
import { Outlet, useLocation } from 'react-router-dom';
import { CustomerHeader } from './components/CustomerHeader';
import { CustomerList } from './components/CustomerList';
import { RouteDebug } from '@/components/RouteDebug';

const getPageTitle = (pathname: string) => {
  if (pathname.endsWith('/novo')) return 'Novo Cliente';
  if (pathname.includes('/editar')) return 'Editar Cliente';
  if (pathname.includes('/importar')) return 'Importar Clientes';
  return 'Clientes';
};

const CustomerPage = () => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  
  // Verifica se estamos na rota raiz de clientes
  const isRootPath = location.pathname === '/cadastros/clientes';
  
  return (
    <div className="space-y-6">
      <CustomerHeader title={title} />
      <div className="container mx-auto px-4 py-6">
        {isRootPath ? <CustomerList /> : <Outlet />}
      </div>
      <RouteDebug />
    </div>
  );
};

export default CustomerPage;