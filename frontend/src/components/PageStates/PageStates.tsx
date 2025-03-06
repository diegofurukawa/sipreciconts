// src/components/PageStates/PageStates.tsx
import React from 'react';
import { AlertTriangle, FolderOpen, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/utils/logger';

// Propriedades para o estado de carregamento
export interface LoadingStateProps {
  /** Mensagem a ser exibida durante o carregamento */
  message?: string;
  /** Tamanho do indicador de carregamento */
  size?: 'small' | 'medium' | 'large';
  /** Classes CSS adicionais */
  className?: string;
  /** Identificador para logging */
  pageId?: string;
}

// Propriedades para o estado vazio
export interface EmptyStateProps {
  /** Título do estado vazio */
  title?: string;
  /** Descrição do estado vazio */
  description?: string;
  /** Ícone personalizado */
  icon?: React.ReactNode;
  /** Ação a ser exibida (geralmente um botão) */
  action?: React.ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Identificador para logging */
  pageId?: string;
}

// Propriedades para o estado de erro
export interface ErrorStateProps {
  /** Título do erro */
  title?: string;
  /** Mensagem de erro detalhada */
  message?: string;
  /** Ícone personalizado */
  icon?: React.ReactNode;
  /** Callback para tentar novamente */
  onRetry?: () => void;
  /** Texto do botão de retry */
  retryText?: string;
  /** Classes CSS adicionais */
  className?: string;
  /** Identificador para logging */
  pageId?: string;
}

/**
 * Componente para exibir estado de carregamento
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando...',
  size = 'medium',
  className = '',
  pageId
}) => {
  // Registra atividade de renderização se pageId fornecido
  React.useEffect(() => {
    if (pageId) {
      logger.debug('StateRendering', 'Rendering loading state', { pageId, state: 'loading' });
    }
  }, [pageId]);

  // Ajustar tamanho do spinner conforme a prop size
  const spinnerSizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  // Ajustar tamanho do texto conforme a prop size
  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-emerald-600 ${spinnerSizes[size]}`}></div>
      <p className={`mt-4 text-gray-600 ${textSizes[size]}`}>{message}</p>
    </div>
  );
};

/**
 * Componente para exibir estado vazio (sem dados)
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum item encontrado',
  description = 'Não existem itens para exibir.',
  icon = <FolderOpen className="w-12 h-12" />,
  action,
  className = '',
  pageId
}) => {
  // Registra atividade de renderização se pageId fornecido
  React.useEffect(() => {
    if (pageId) {
      logger.debug('StateRendering', 'Rendering empty state', { pageId, state: 'empty' });
    }
  }, [pageId]);

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="text-gray-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};

/**
 * Componente para exibir estado de erro
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocorreu um erro',
  message = 'Não foi possível carregar os dados. Por favor, tente novamente.',
  icon = <AlertTriangle className="h-12 w-12" />,
  onRetry,
  retryText = 'Tentar novamente',
  className = '',
  pageId
}) => {
  // Registra atividade de renderização se pageId fornecido
  React.useEffect(() => {
    if (pageId) {
      logger.debug('StateRendering', 'Rendering error state', { 
        pageId, 
        state: 'error',
        errorMessage: message 
      });
    }
  }, [pageId, message]);

  // Registra tentativa de retry se pageId fornecido
  const handleRetry = () => {
    if (pageId) {
      logger.userAction('error_retry', { pageId, errorMessage: message });
    }
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="text-red-500 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button 
          onClick={handleRetry}
          variant="outline"
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {retryText}
        </Button>
      )}
    </div>
  );
};