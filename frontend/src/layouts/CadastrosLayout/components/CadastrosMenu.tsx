// src/layouts/CadastrosLayout/components/CadastrosMenu.tsx (exemplo de atualização)
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Building2, Users, Calculator, Package2 } from 'lucide-react';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
          isActive
            ? 'bg-emerald-100 text-emerald-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: `mr-3 h-5 w-5 ${isActive ? 'text-emerald-500' : 'text-gray-500'}`
      })}
      {label}
    </NavLink>
  );
};

const CadastrosMenu: React.FC = () => {
  return (
    <div className="space-y-1 py-2">
      <MenuItem
        to={CADASTROS_ROUTES.EMPRESA.ROOT}
        icon={<Building2 />}
        label="Empresas"
      />
      <MenuItem
        to={CADASTROS_ROUTES.CLIENTES.ROOT}
        icon={<Users />}
        label="Clientes"
      />
      <MenuItem
        to={CADASTROS_ROUTES.IMPOSTOS.ROOT}
        icon={<Calculator />}
        label="Impostos e Taxas"
      />
      <MenuItem
        to={CADASTROS_ROUTES.INSUMOS.ROOT}
        icon={<Package2 />}
        label="Insumos"
      />
    </div>
  );
};

export default CadastrosMenu;