// src/layouts/MainLayout/components/Navbar.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronDown, 
  Menu,
  Home,
  Building2,
  Users,
  Calculator,
  Package,
  ScrollText,
  ClipboardList,
  FileSpreadsheet,
  HelpCircle,
  Settings,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/core/auth";
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/routes/config/route-paths';
import { UserMenu } from './UserMenu';

// Tipos
interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface MenuGroup {
  label: string;
  icon: LucideIcon;
  path?: string;
  items: MenuItem[];
}

// Constantes separadas para melhor manutenção
const MENU_ITEMS: MenuGroup[] = [
  {
    label: 'Home',
    icon: Home,
    path: ROUTES.PRIVATE.HOME,
    items: []
  },
  {
    label: 'Cadastros',
    icon: Building2,
    items: [
      { 
        label: 'Empresa', 
        path: ROUTES.PRIVATE.CADASTROS.EMPRESA.ROOT, 
        icon: Building2 
      },
      { 
        label: 'Clientes', 
        path: ROUTES.PRIVATE.CADASTROS.CLIENTES.ROOT, 
        icon: Users 
      },
      { 
        label: 'Impostos', 
        path: ROUTES.PRIVATE.CADASTROS.IMPOSTOS.ROOT, 
        icon: Calculator 
      },
      { 
        label: 'Insumos', 
        path: ROUTES.PRIVATE.CADASTROS.INSUMOS.ROOT, 
        icon: Package 
      }
    ]
  },
  {
    label: 'Comercial',
    icon: ScrollText,
    items: [
      { 
        label: 'Orçamentos', 
        path: ROUTES.PRIVATE.COMERCIAL.ORCAMENTOS.ROOT, 
        icon: ClipboardList 
      },
      { 
        label: 'Contratos', 
        path: ROUTES.PRIVATE.COMERCIAL.CONTRATOS.ROOT, 
        icon: FileSpreadsheet 
      }
    ]
  },
  {
    label: 'Relatórios',
    icon: BarChart3,
    path: ROUTES.PRIVATE.RELATORIOS.ROOT,
    items: []
  },
  {
    label: 'Configurações',
    icon: Settings,
    path: ROUTES.PRIVATE.CONFIGURACOES.ROOT,
    items: []
  },
  {
    label: 'Ajuda',
    icon: HelpCircle,
    path: ROUTES.PRIVATE.AJUDA.ROOT,
    items: []
  }
];

interface MenuButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  hasDropdown?: boolean;
}

const MenuButton = ({ 
  icon: Icon,
  label, 
  isActive, 
  onClick, 
  hasDropdown = false 
}: MenuButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex items-center px-3 py-2 rounded-md w-full
      ${isActive ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'}
      transition-colors duration-200
    `}
  >
    <Icon size={18} className="mr-2 flex-shrink-0" />
    <span className="flex-1 text-left">{label}</span>
    {hasDropdown && (
      <ChevronDown 
        size={16} 
        className={`transform transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
      />
    )}
  </button>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { showToast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setActiveDropdown('');
  }, [navigate]);

  const handleDropdownClick = useCallback((menu: string) => {
    setActiveDropdown(prev => prev === menu ? '' : menu);
  }, []);

  const handlesignOut = useCallback(async () => {
    try {
      await signOut();
      showToast({
        type: 'success',
        title: 'signOut realizado',
        message: 'Você foi desconectado com sucesso'
      });
      navigate(ROUTES.PUBLIC.LOGIN);
    } catch (error) {
      console.error('Erro ao fazer signOut:', error);
      showToast({
        type: 'error',
        title: 'Erro no signOut',
        message: 'Ocorreu um erro ao tentar desconectar'
      });
    } finally {
      setIsMenuOpen(false);
    }
  }, [signOut, showToast, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown('');
  }, [location.pathname]);

  const isActiveRoute = useCallback((path?: string): boolean => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleNavigate(ROUTES.PRIVATE.HOME)}
              className="text-xl font-bold text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md transition-colors duration-200"
            >
              SiPreciConts
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2" ref={dropdownRef}>
            {MENU_ITEMS.map((group) => (
              <div key={group.label} className="relative">
                <MenuButton
                  icon={group.icon}
                  label={group.label}
                  isActive={group.path ? isActiveRoute(group.path) : activeDropdown === group.label}
                  onClick={() => group.path ? handleNavigate(group.path) : handleDropdownClick(group.label)}
                  hasDropdown={group.items.length > 0}
                />
                {activeDropdown === group.label && group.items.length > 0 && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                    {group.items.map(item => (
                      <MenuButton
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        isActive={isActiveRoute(item.path)}
                        onClick={() => handleNavigate(item.path)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
            <UserMenu 
              isMobile={false} 
              onLogout={handlesignOut} 
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {MENU_ITEMS.map(group => (
              <div key={group.label}>
                <MenuButton
                  icon={group.icon}
                  label={group.label}
                  isActive={group.path ? isActiveRoute(group.path) : activeDropdown === group.label}
                  onClick={() => group.path ? handleNavigate(group.path) : handleDropdownClick(group.label)}
                  hasDropdown={group.items.length > 0}
                />
                {activeDropdown === group.label && group.items.length > 0 && (
                  <div className="pl-4 space-y-1">
                    {group.items.map(item => (
                      <MenuButton
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        isActive={isActiveRoute(item.path)}
                        onClick={() => handleNavigate(item.path)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <UserMenu 
            isMobile={true} 
            onLogout={handlesignOut} 
          />
        </div>
      )}
    </nav>
  );
};

export { Navbar as Navbar };