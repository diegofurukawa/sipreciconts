// src/layouts/MainLayout/components/Navbar.tsx
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ComponentType;
}

interface MenuItems {
  [key: string]: MenuItem[];
}

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItems = {
    Cadastros: [
      { label: 'Empresa', path: '/cadastros/empresa' },
      { label: 'Clientes', path: '/cadastros/clientes' },
      { label: 'Impostos', path: '/cadastros/impostos' },
      { label: 'Insumos', path: '/cadastros/insumos' }
    ],
    Comercial: [
      { label: 'Orçamento', path: '/comercial/orcamento' },
      { label: 'Contratos', path: '/comercial/contratos' }
    ],
    Ajuda: []
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fechar menu mobile ao mudar de rota
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
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigate('/')} 
              className="text-xl font-bold text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md"
              aria-label="Ir para página inicial"
            >
              SiPreciConts
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center" ref={dropdownRef}>
            <button 
              onClick={() => handleNavigate('/')}
              className={`px-4 py-2 mx-2 rounded-md transition-colors ${
                isActiveRoute('/') 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Home
            </button>
            {Object.entries(menuItems).map(([menu, items]) => (
              <div key={menu} className="relative mx-2">
                <button
                  onClick={() => handleDropdownClick(menu)}
                  className={`flex items-center px-4 py-2 space-x-2 rounded-md transition-colors ${
                    activeDropdown === menu
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                  aria-expanded={activeDropdown === menu}
                  aria-controls={`${menu}-menu`}
                >
                  <span>{menu}</span>
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform ${
                      activeDropdown === menu ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {items.length > 0 && activeDropdown === menu && (
                  <div 
                    id={`${menu}-menu`}
                    className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 transform opacity-100 scale-100 transition-all duration-200"
                  >
                    <div className="py-1">
                      {items.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleNavigate(item.path)}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActiveRoute(item.path)
                              ? 'text-emerald-600 bg-emerald-50'
                              : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* User Menu - Desktop */}
            {user && (
              <div className="flex items-center ml-4 space-x-4 border-l pl-4">
                <div className="flex items-center text-gray-700">
                  <User size={18} className="mr-2" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  <LogOut size={18} className="mr-2" />
                  <span className="text-sm">Sair</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
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
        className={`md:hidden border-t border-gray-200 transform transition-transform duration-200 ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            onClick={() => handleNavigate('/')}
            className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActiveRoute('/')
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
            }`}
          >
            Home
          </button>
          {Object.entries(menuItems).map(([menu, items]) => (
            <div key={menu} className="space-y-1">
              <button
                onClick={() => handleDropdownClick(menu)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  activeDropdown === menu
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                <span>{menu}</span>
                <ChevronDown 
                  size={16}
                  className={`transform transition-transform ${
                    activeDropdown === menu ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {items.length > 0 && activeDropdown === menu && (
                <div className="pl-4 space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavigate(item.path)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        isActiveRoute(item.path)
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* User Menu - Mobile */}
          {user && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="px-3 py-2 text-gray-700">
                <User size={18} className="inline mr-2" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors rounded-md"
              >
                <LogOut size={18} className="mr-2" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};