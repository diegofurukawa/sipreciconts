export const Footer = () => {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna 1 - Logo e Descrição */}
            <div>
              <h3 className="text-lg font-semibold text-emerald-600 mb-4">SiPreciConts</h3>
              <p className="text-gray-600 text-sm">
                Sistema de Precificação e Contratos para gerenciamento eficiente de seus negócios.
              </p>
            </div>
  
            {/* Coluna 2 - Links Rápidos */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/cadastros/clientes" className="text-gray-600 hover:text-emerald-600 text-sm">
                    Cadastro de Clientes
                  </a>
                </li>
                <li>
                  <a href="/comercial/orcamento" className="text-gray-600 hover:text-emerald-600 text-sm">
                    Orçamentos
                  </a>
                </li>
                <li>
                  <a href="/comercial/contratos" className="text-gray-600 hover:text-emerald-600 text-sm">
                    Contratos
                  </a>
                </li>
              </ul>
            </div>
  
            {/* Coluna 3 - Contato */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Suporte: suporte@sipreciconts.com</li>
                <li>Tel: (11) 9999-9999</li>
                <li>Seg - Sex: 9:00 - 18:00</li>
              </ul>
            </div>
          </div>
  
          {/* Copyright */}
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; {currentYear} SiPreciConts. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    );
  };