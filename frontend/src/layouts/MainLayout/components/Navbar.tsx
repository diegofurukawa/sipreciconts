// src/layouts/MainLayout/components/Navbar.tsx
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

const Navbar = () => {
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
    setIsMenuOpen(false);
    setActiveDropdown('');
  }, [location]);

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
        message: 'Não foi possível realizar o logout'
      });
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const renderUserMenu = (isMobile = false) => (
    user && (
      <div className={isMobile ? "border-t border-gray-200 pt-4 mt-4" : "flex items-center ml-4 space-x-4 border-l pl-4"}>
        <div className="flex items-center text-gray-700">
          <User size={18} className="mr-2" />
          <span className={`${isMobile ? 'text-sm' : ''} font-medium`}>{user.name}</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className={`flex items-center ${
            isMobile 
              ? "w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100" 
              : "text-gray-700 hover:text-red-600"
          } transition-colors duration-200 rounded-md`}
        >
          <LogOut size={18} className="mr-2" />
          <span>Sair</span>
        </button>
      </div>
    )
  );

  const renderMenuItem = (item: MenuItem, isMobile = false) => (
    <button
      type="button"
      key={item.label}
      onClick={() => handleNavigate(item.path)}
      className={`flex items-center ${
        isMobile ? "w-full text-left px-3 py-2 text-sm" : "w-full text-left px-4 py-2 text-sm"
      } transition-colors duration-200 ${
        isActiveRoute(item.path)
          ? 'text-emerald-600 bg-emerald-50'
          : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
      }`}
    >
      <item.icon size={16} className="mr-2" />
      {item.label}
    </button>
  );

  const renderMenuGroup = (group: MenuGroup, isMobile = false) => (
    <div key={group.label} className={isMobile ? "space-y-1" : "relative mx-2"}>
      <button
        type="button"
        onClick={() => handleDropdownClick(group.label)}
        className={`flex items-center ${
          isMobile 
            ? "w-full justify-between px-3 py-2 text-base font-medium"
            : "px-4 py-2 space-x-2"
        } rounded-md transition-colors duration-200 ${
          activeDropdown === group.label
            ? 'text-emerald-600 bg-emerald-50'
            : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
        }`}
        aria-expanded={activeDropdown === group.label}
        aria-controls={`${group.label}-menu`}
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
      {group.items.length > 0 && activeDropdown === group.label && (
        <div 
          id={`${group.label}-menu`}
          className={isMobile 
            ? "pl-4 space-y-1"
            : "absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          }
        >
          <div className={isMobile ? "" : "py-1"}>
            {group.items.map(item => renderMenuItem(item, isMobile))}
          </div>
        </div>
      )}
    </div>
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
          <div className="hidden md:flex items-center" ref={dropdownRef}>
            <button 
              type="button"
              onClick={() => handleNavigate(ROUTES.PRIVATE.HOME)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                isActiveRoute(ROUTES.PRIVATE.HOME) 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              <Home size={18} className="mr-2" />
              <span>Home</span>
            </button>

            {menuItems.map(group => renderMenuGroup(group))}
            {renderUserMenu()}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Abrir menu principal</span>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu" 
        className={`md:hidden border-t border-gray-200 transform transition-all duration-200 ease-in-out ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            type="button"
            onClick={() => handleNavigate(ROUTES.PRIVATE.HOME)}
            className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              isActiveRoute(ROUTES.PRIVATE.HOME)
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
            }`}
          >
            <Home size={18} className="mr-2" />
            Home
          </button>

          {menuItems.map(group => renderMenuGroup(group, true))}
          {renderUserMenu(true)}
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
export default Navbar;