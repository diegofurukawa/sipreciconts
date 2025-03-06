// src/components/ProfileDropdownMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown, Shield, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/auth/context/AuthContext';

interface ProfileDropdownMenuProps {
  className?: string;
}

const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
          {user.user_name?.[0] || user.name?.[0] || 'U'}
        </div>
        <span className="hidden md:inline">{user.user_name || user.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900 truncate">{user.user_name || user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          
          <a
            onClick={() => { navigate('/perfil'); setIsOpen(false); }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
          >
            <User className="h-4 w-4 mr-2" />
            Meu Perfil
          </a>
          
          <a
            onClick={() => { navigate('/perfil/session'); setIsOpen(false); }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
          >
            <Shield className="h-4 w-4 mr-2" />
            Detalhes da Sessão
          </a>
          
          <a
            onClick={() => { navigate('/configuracoes'); setIsOpen(false); }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </a>
          
          <div className="border-t border-gray-200 my-1"></div>
          
          <a
            onClick={() => { handleLogout(); setIsOpen(false); }}
            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </a>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdownMenu;