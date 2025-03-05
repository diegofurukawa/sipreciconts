// src/components/UserProfileDropdown/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  ChevronDown, 
  Settings, 
  Clock, 
  Building, 
  Shield, 
  Mail,
  UserCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/auth/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/auth/services/authService';

interface UserProfileDropdownProps {
  isMobile?: boolean;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ 
  isMobile = false 
}) => {
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch session details
  const fetchSessionDetails = async () => {
    if (!isOpen || sessionDetails) return;
    
    try {
      setLoading(true);
      const validation = await authService.validate();
      if (validation && validation.user) {
        setSessionDetails(validation.user);
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchSessionDetails();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      showToast({
        type: 'success',
        title: 'Logout realizado',
        message: 'Você foi desconectado com sucesso'
      });
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      showToast({
        type: 'error',
        title: 'Erro no logout',
        message: 'Ocorreu um erro ao tentar desconectar'
      });
    }
  };

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR
      });
    } catch (e) {
      return 'Data inválida';
    }
  };

  // Close dropdown when clicking outside
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

  // If no user, don't render anything
  if (!user) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="px-4 py-3">
          <p className="text-sm font-medium text-gray-900">{user.name || user.user_name}</p>
          {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
        </div>
        
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 hover:text-gray-900 ml-4 space-x-1 border-l pl-4"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium text-sm">{user.name || user.user_name}</span>
            <span className="text-xs text-gray-500 truncate max-w-[120px]">
              {user.company_name || user.email || user.login}
            </span>
          </div>
        </div>
        <ChevronDown 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <p className="text-sm font-medium text-gray-900">{user.name || user.user_name}</p>
            {user.email && <p className="text-xs text-gray-500">{user.email}</p>}
          </div>

          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Informações da Sessão
            </h3>

            {loading ? (
              <div className="flex justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Building className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Empresa</p>
                    <p className="text-sm">{sessionDetails?.company_name || user.company_name || 'Não disponível'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Tipo de usuário</p>
                    <p className="text-sm">{sessionDetails?.type || user.type || 'Não disponível'}</p>
                  </div>
                </div>

                {sessionDetails?.last_login && (
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Último login</p>
                      <p className="text-sm">{formatDate(sessionDetails.last_login)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/perfil/session');
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Detalhes da Sessão
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/configuracoes/perfil');
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </button>
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;