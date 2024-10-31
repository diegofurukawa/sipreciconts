// src/layouts/MainLayout/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-emerald-600">SiPreciConts</h3>
            <p className="mt-2 text-sm text-gray-600">
              Sistema de Precificação e Contratos para gerenciamento eficiente de seus negócios.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Links Rápidos</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/cadastros/clientes" className="text-sm text-gray-600 hover:text-emerald-600">
                  Cadastro de Clientes
                </Link>
              </li>
              <li>
                <Link to="/comercial/orcamentos" className="text-sm text-gray-600 hover:text-emerald-600">
                  Orçamentos
                </Link>
              </li>
              <li>
                <Link to="/comercial/contratos" className="text-sm text-gray-600 hover:text-emerald-600">
                  Contratos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Contato</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>Suporte: suporte@sipreciconts.com</li>
              <li>Tel: (11) 9999-9999</li>
              <li>Seg - Sex: 9:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} SiPreciConts. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
