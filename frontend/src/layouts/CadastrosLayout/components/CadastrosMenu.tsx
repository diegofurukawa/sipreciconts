// src/layouts/CadastrosLayout/components/CadastrosMenu.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Users, Calculator, Package } from 'lucide-react';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';

const CadastrosMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: 'Empresa',
      path: CADASTROS_ROUTES.EMPRESA.ROOT,
      icon: Building2
    },
    {
      label: 'Clientes',
      path: CADASTROS_ROUTES.CLIENTES.ROOT,
      icon: Users
    },
    {
      label: 'Impostos',
      path: CADASTROS_ROUTES.IMPOSTOS.ROOT,
      icon: Calculator
    },
    {
      label: 'Insumos',
      path: CADASTROS_ROUTES.INSUMOS.ROOT,
      icon: Package
    }
  ];

  return (
    <nav className="space-y-1">
      {menuItems.map(({ label, path, icon: Icon }) => {
        const isActive = location.pathname.startsWith(path);
        
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`
              flex items-center w-full px-4 py-2 text-sm rounded-md
              ${isActive 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'}
            `}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </button>
        );
      })}
    </nav>
  );
};

export {
    CadastrosMenu
};