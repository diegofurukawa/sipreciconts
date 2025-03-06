// src/components/UserProfileDropdown.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  ChevronDown, 
  Settings, 
  Shield, 
  UserCircle
} from 'lucide-react';
import { useAuth } from "@/auth/context/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

interface UserProfileDropdownProps {
  isMobile?: boolean;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ 
  isMobile = false 
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getDisplayName = () => {
    return user.user_name || user.name || user.login;
  };

  if (isMobile) {
    return (
      <div className="border-t border-gray-200 pt-4 mt-4 px-2">
        <DropdownMenuLabel className="text-sm font-medium text-gray-500 mb-2">
          Perfil do Usuário
        </DropdownMenuLabel>
        
        <div className="flex items-center mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            {getDisplayName().charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{getDisplayName()}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <DropdownMenuItem 
            className="w-full flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => navigate('/perfil')}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Meu Perfil
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="w-full flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => navigate('/perfil/session')}
          >
            <Shield className="mr-2 h-4 w-4" />
            Detalhes da Sessão
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="w-full flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => navigate('/configuracoes')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="my-1 border-t border-gray-200" />
          
          <DropdownMenuItem 
            className="w-full flex items-center p-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center space-x-1 h-9 rounded-md px-2 text-sm border border-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white">
          {getDisplayName().charAt(0).toUpperCase()}
        </div>
        <span className="max-w-[100px] truncate hidden md:block">{getDisplayName()}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
            <p className="text-xs leading-none text-gray-500">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate('/perfil')}>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Meu Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/perfil/session')}>
          <Shield className="mr-2 h-4 w-4" />
          <span>Detalhes da Sessão</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 hover:text-red-700 focus:bg-red-50 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;