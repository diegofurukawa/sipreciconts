// src/layouts/MainLayout/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock } from 'lucide-react';
import { ROUTES } from '@/routes/config/route-paths';

interface QuickLink {
  label: string;
  path: string;
}

interface ContactInfo {
  icon: typeof Mail | typeof Phone | typeof Clock;
  label: string;
  value: string;
}

const quickLinks: QuickLink[] = [
  {
    label: 'Cadastro de Clientes',
    path: ROUTES.PRIVATE.CADASTROS.CLIENTES.ROOT
  },
  {
    label: 'Orçamentos',
    path: ROUTES.PRIVATE.COMERCIAL.ORCAMENTOS.ROOT
  },
  {
    label: 'Contratos',
    path: ROUTES.PRIVATE.COMERCIAL.CONTRATOS.ROOT
  }
];

const contactInfo: ContactInfo[] = [
  {
    icon: Mail,
    label: 'Email de Suporte',
    value: 'suporte@sipreciconts.com'
  },
  {
    icon: Phone,
    label: 'Telefone',
    value: '(11) 9999-9999'
  },
  {
    icon: Clock,
    label: 'Horário de Funcionamento',
    value: 'Seg - Sex: 9:00 - 18:00'
  }
];

const staticLinks = {
  privacidade: '/privacidade',
  termos: '/termos'
} as const;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Rodapé</h2>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna da Empresa */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-emerald-600">
                <Link 
                  to={ROUTES.PRIVATE.HOME}
                  className="hover:text-emerald-700 transition-colors duration-200"
                  aria-label="Ir para página inicial"
                >
                  SiPreciConts
                </Link>
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Sistema de Precificação e Contratos para gerenciamento eficiente de seus negócios.
              </p>
            </div>
            
            {/* Informações de Privacidade/Termos */}
            <div className="pt-4 text-sm space-x-4">
              <Link 
                to={staticLinks.privacidade}
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                Política de Privacidade
              </Link>
              <Link 
                to={staticLinks.termos}
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                Termos de Uso
              </Link>
            </div>
          </div>

          {/* Links Rápidos */}
          <nav aria-label="Links rápidos" className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Links Rápidos</h4>
            <ul className="space-y-3" role="list">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center"
                  >
                    <span className="sr-only">Ir para {link.label}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Informações de Contato */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Contato</h4>
            <ul className="space-y-3" role="list">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <li key={index} className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="flex-1">
                      <span className="sr-only">{info.label}:</span>
                      <span className="text-sm text-gray-600">{info.value}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            
            {/* Redes Sociais */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Siga-nos</h4>
              <div className="flex space-x-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                  aria-label="Visite nossa página no LinkedIn"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            &copy; {currentYear} SiPreciConts. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
export default Footer;