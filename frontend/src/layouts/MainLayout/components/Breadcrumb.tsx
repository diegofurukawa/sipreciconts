import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Mapeamento de rotas para nomes amigáveis
  const routeNames: { [key: string]: string } = {
    cadastros: 'Cadastros',
    impostos: 'Impostos',
    clientes: 'Clientes',
    empresa: 'Empresa',
    comercial: 'Comercial',
    orcamentos: 'Orçamentos',
    contratos: 'Contratos',
  };

  return (
    <nav className="flex items-center text-sm text-gray-500">
      <Link
        to="/"
        className="flex items-center hover:text-gray-700 transition-colors"
      >
        <Home size={16} className="mr-1" />
        Início
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = routeNames[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={16} className="mx-2" />
            {last ? (
              <span className="text-gray-900 font-medium">{name}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-gray-700 transition-colors"
              >
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};