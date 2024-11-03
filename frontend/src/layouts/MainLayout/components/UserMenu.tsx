// src/layouts/MainLayout/components/UserMenu.tsx
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  isMobile: boolean;
  onLogout: () => void;
}

const UserMenu = ({ isMobile, onLogout }: UserMenuProps) => {
  const { user } = useAuth();
  
  // Se não houver usuário logado, não renderiza nada
  if (!user) {
    return null;
  }

  return (
    <div className={`
      ${isMobile 
        ? "border-t border-gray-200 pt-4 mt-4" 
        : "flex items-center ml-4 space-x-4 border-l pl-4"
      }
    `}>
      <div className="flex flex-col items-start">
        <div className="flex items-center text-gray-700">
          <User size={18} className="mr-2 flex-shrink-0" />
          <span className="font-medium truncate">{user.name}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className={`
          flex items-center
          ${isMobile 
            ? "w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100" 
            : "text-gray-700 hover:text-red-600"
          }
          transition-colors duration-200 rounded-md
        `}
      >
        <LogOut size={18} className="mr-2 flex-shrink-0" />
        <span>Sair</span>
      </button>
    </div>
  );
};

export {
    UserMenu
};