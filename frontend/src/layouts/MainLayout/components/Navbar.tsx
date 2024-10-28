import { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const navigate = useNavigate();

  const menuItems = {
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

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setActiveDropdown('');
  };

  const handleDropdownClick = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? '' : menu);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigate('/')} 
              className="text-xl font-bold text-emerald-600 hover:text-emerald-700"
            >
              SiPreciConts
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={() => handleNavigate('/')}
              className="px-4 py-2 mx-2 text-gray-700 hover:text-emerald-600 rounded-md"
            >
              Home
            </button>
            {Object.entries(menuItems).map(([menu, items]) => (
              <div key={menu} className="relative mx-2">
                <button
                  onClick={() => handleDropdownClick(menu)}
                  className="flex items-center px-4 py-2 space-x-2 text-gray-700 hover:text-emerald-600 rounded-md"
                >
                  <span>{menu}</span>
                  <ChevronDown size={16} />
                </button>
                {items.length > 0 && activeDropdown === menu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {items.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleNavigate(item.path)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleNavigate('/')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
            >
              Home
            </button>
            {Object.entries(menuItems).map(([menu, items]) => (
              <div key={menu} className="space-y-1">
                <button
                  onClick={() => handleDropdownClick(menu)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
                >
                  <span>{menu}</span>
                  <ChevronDown size={16} />
                </button>
                {items.length > 0 && activeDropdown === menu && (
                  <div className="pl-4 space-y-1">
                    {items.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavigate(item.path)}
                        className="block w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};