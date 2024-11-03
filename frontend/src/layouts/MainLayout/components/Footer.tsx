// src/layouts/MainLayout/components/Footer.tsx
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white mt-auto border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1 - Sobre */}
          <div>
            <h3 className="text-emerald-600 text-lg font-semibold mb-4">SiPreciConts</h3>
            <p className="text-gray-600 text-sm">
              Sistema de Precificação e Contratos para gerenciamento eficiente de seus negócios.
            </p>
            <div className="mt-4 space-x-4">
              <Link to="/privacidade" className="text-gray-600 text-sm hover:text-emerald-600">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="text-gray-600 text-sm hover:text-emerald-600">
                Termos de Uso
              </Link>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cadastros/clientes" className="text-gray-600 hover:text-emerald-600">
                  Cadastro de Clientes
                </Link>
              </li>
              <li>
                <Link to="/comercial/orcamentos" className="text-gray-600 hover:text-emerald-600">
                  Orçamentos
                </Link>
              </li>
              <li>
                <Link to="/comercial/contratos" className="text-gray-600 hover:text-emerald-600">
                  Contratos
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Contato */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                suporte@sipreciconts.com
              </li>
              <li className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                (11) 9999-9999
              </li>
              <li className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Seg - Sex: 9:00 - 18:00
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export {
    Footer
};