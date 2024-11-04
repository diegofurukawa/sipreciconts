// src/layouts/CadastrosLayout/index.tsx
import { Outlet } from 'react-router-dom';
import { CadastrosMenu } from './components/CadastrosMenu';

const CadastrosLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Menu lateral */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <CadastrosMenu />
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default CadastrosLayout;