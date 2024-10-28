import { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');

  const menuItems = {
    Cadastros: ['Empresa', 'Clientes', 'Impostos', 'Insumos'],
    Comercial: ['Orçamento', 'Contratos'],
    Ajuda: []
  };

  const handleDropdownClick = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? '' : menu);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-emerald-600">SiPreciConts</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md">
              Home
            </a>
            {Object.entries(menuItems).map(([menu, items]) => (
              <div key={menu} className="relative group">
                <button
                  onClick={() => handleDropdownClick(menu)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md"
                >
                  <span>{menu}</span>
                  <ChevronDown size={16} />
                </button>
                {items.length > 0 && activeDropdown === menu && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {items.map((item) => (
                        <a
                          key={item}
                          href={`/${menu.toLowerCase()}/${item.toLowerCase()}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
            >
              Home
            </a>
            {Object.entries(menuItems).map(([menu, items]) => (
              <div key={menu}>
                <button
                  onClick={() => handleDropdownClick(menu)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
                >
                  <span>{menu}</span>
                  <ChevronDown size={16} />
                </button>
                {items.length > 0 && activeDropdown === menu && (
                  <div className="pl-4">
                    {items.map((item) => (
                      <a
                        key={item}
                        href={`/${menu.toLowerCase()}/${item.toLowerCase()}`}
                        className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
                      >
                        {item}
                      </a>
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