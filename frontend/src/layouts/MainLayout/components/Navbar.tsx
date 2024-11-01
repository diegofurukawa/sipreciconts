import { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  Menu, 
  LogOut, 
  User,
  Home,
  Building2,
  Users,
  Calculator,
  Package,
  ScrollText,
  ClipboardList,
  FileSpreadsheet,
  HelpCircle,
  type LucideIcon
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/routes/config/route-paths';

interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface MenuGroup {
  label: string;
  icon: LucideIcon;
  items: MenuItem[];
}

const menuItems: MenuGroup[] = [
  {
    label: 'Cadastros',
    icon: Building2,
    items: [
      { 
        label: 'Empresa', 
        path: ROUTES.PRIVATE.CADASTROS.EMPRESA, 
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
        label: 'Orçamento', 
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
    label: 'Ajuda',
    icon: HelpCircle,
    items: []
  }
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    // Fecha os menus quando a rota muda
    setIsMenuOpen(false);
    setActiveDropdown('');
  }, [location.pathname]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setActiveDropdown('');
  };

  const handleDropdownClick = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? '' : menu);
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast({
        type: 'success',
        title: 'Logout realizado',
        message: 'Você foi desconectado com sucesso'
      });
      navigate(ROUTES.PUBLIC.LOGIN);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      showToast({
        type: 'error',
        title: 'Erro no logout',
        message: 'Ocorreu um erro ao tentar desconectar'
      });
    } finally {
      setIsMenuOpen(false);
    }
  };

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const renderMenuItem = (item: MenuItem, isMobile = false) => (
    <button
      key={item.path}
      type="button"
      onClick={() => handleNavigate(item.path)}
      className={`
        flex items-center w-full text-left
        ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-sm'}
        ${isActiveRoute(item.path)
          ? 'text-emerald-600 bg-emerald-50'
          : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
        }
        transition-colors duration-200
      `}
    >
      <item.icon size={16} className="mr-2 flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </button>
  );

  const renderUserMenu = (isMobile = false) => (
    user && (
      <div className={`
        ${isMobile 
          ? "border-t border-gray-200 pt-4 mt-4" 
          : "flex items-center ml-4 space-x-4 border-l pl-4"
        }
      `}>
        <div className="flex items-center text-gray-700">
          <User size={18} className="mr-2 flex-shrink-0" />
          <span className="font-medium truncate">{user.name}</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
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
    )
  );

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
            {menuItems.map((group) => (
              <div key={group.label} className="relative">
                <button
                  type="button"
                  onClick={() => handleDropdownClick(group.label)}
                  className={`
                    flex items-center px-3 py-2 rounded-md
                    ${activeDropdown === group.label
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                    }
                    transition-colors duration-200
                  `}
                >
                  <group.icon size={18} className="mr-2" />
                  <span>{group.label}</span>
                  <ChevronDown 
                    size={16} 
                    className={`ml-2 transform transition-transform duration-200 ${
                      activeDropdown === group.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeDropdown === group.label && group.items.length > 0 && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                    {group.items.map(item => renderMenuItem(item))}
                  </div>
                )}
              </div>
            ))}
            {renderUserMenu()}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map(group => (
              <div key={group.label}>
                <button
                  type="button"
                  onClick={() => handleDropdownClick(group.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    <group.icon size={18} className="mr-2" />
                    <span>{group.label}</span>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform duration-200 ${
                      activeDropdown === group.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeDropdown === group.label && group.items.length > 0 && (
                  <div className="pl-4 space-y-1">
                    {group.items.map(item => renderMenuItem(item, true))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {renderUserMenu(true)}
        </div>
      )}
    </nav>
  );
};

export default Navbar;