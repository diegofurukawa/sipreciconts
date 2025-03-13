// src/components/ui/breadcrumb.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '@/routes/config/route-paths';

// Interface para os itens do breadcrumb
interface BreadcrumbItem {
  label: string;
  path: string;
}

// Mapeamento de rotas para labels legíveis
const ROUTE_LABELS: Record<string, string> = {
  'cadastros': 'Cadastros',
  'empresa': 'Empresas',
  'clientes': 'Clientes',
  'impostos': 'Impostos',
  'insumos': 'Insumos',
  'usuarios': 'Usuários',
  'comercial': 'Comercial',
  'contratos': 'Contratos',
  'orcamentos': 'Orçamentos',
  'configuracoes': 'Configurações',
  'relatorios': 'Relatórios',
  'novo': 'Novo',
  'editar': 'Editar',
  'importar': 'Importar',
};

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Função para gerar os itens do breadcrumb
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    // Sempre iniciamos com a Home
    const items: BreadcrumbItem[] = [
      { label: 'Home', path: ROUTES.PRIVATE.HOME }
    ];

    // Construímos o caminho progressivamente
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Se for um ID (número ou código alfanumérico), não adicionamos como item separado
      // mas anexamos ao item anterior
      if (/^\d+$/.test(segment) || (segment.length > 20)) {
        return;
      }

      // Para os segmentos finais "novo" ou "editar", atualizamos o rótulo do último item
      if ((segment === 'novo' || segment === 'editar') && index === pathSegments.length - 1) {
        const prevLabel = items[items.length - 1].label;
        const actionLabel = ROUTE_LABELS[segment] || segment;
        items[items.length - 1].label = `${actionLabel} ${prevLabel}`;
        return;
      }

      const label = ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      items.push({ label, path: currentPath });
    });

    return items;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  // Se só tivermos o item Home, não mostramos o breadcrumb
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.path} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />
              )}
              
              {index === 0 ? (
                // Item Home com ícone
                <Link 
                  to={item.path} 
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-emerald-600"
                >
                  <Home className="mr-1 h-4 w-4" />
                  {item.label}
                </Link>
              ) : isLast ? (
                // Último item (atual) - sem link
                <span className="text-sm font-medium text-emerald-600">
                  {item.label}
                </span>
              ) : (
                // Itens intermediários com links
                <Link 
                  to={item.path} 
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;