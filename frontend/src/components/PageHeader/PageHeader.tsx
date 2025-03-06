// src/components/PageHeader/PageHeader.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { logger } from '@/utils/logger';

export interface PageHeaderProps {
  /** Título principal do cabeçalho */
  title: string;
  
  /** Subtítulo opcional do cabeçalho */
  subtitle?: string;
  
  /** Desativar botão de voltar */
  disableBackButton?: boolean;
  
  /** Rota personalizada para o botão voltar (usa history.back() por padrão) */
  backRoute?: string;
  
  /** Ações adicionais a serem exibidas no cabeçalho */
  actions?: React.ReactNode;
  
  /** Estilo personalizado para o container */
  className?: string;
  
  /** Identificador para logging */
  pageId?: string;
}

/**
 * Componente de cabeçalho de página padrão
 * Exibe título, subtítulo opcional e botão de voltar
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  disableBackButton = false,
  backRoute,
  actions,
  className = '',
  pageId
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    // Registra ação de navegação quando usuário clica no botão voltar
    logger.info('Navigation', { 
      action: 'back_button_clicked',
      page: pageId || title,
      destination: backRoute || 'previous_page'
    });
    
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };
  
  // Registra visualização da página quando o componente é montado
  React.useEffect(() => {
    logger.info('PageView', { 
      page: pageId || title,
      hasSubtitle: !!subtitle,
      hasActions: !!actions
    });
  }, [pageId, title, subtitle, actions]);

  return (
    <div className={`bg-white shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            {!disableBackButton && (
              <button 
                onClick={handleBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;