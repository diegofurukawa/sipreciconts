// src/components/PageHeader/PageHeaderActions.tsx
import React from 'react';
import { Plus, Download, Upload, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/utils/logger';

export interface PageHeaderActionProps {
  /** ID da página para logging */
  pageId?: string;
  
  /** Texto alternativo para o botão 'Novo' */
  newButtonText?: string;
  
  /** Desabilitar botão 'Novo' */
  disableNewButton?: boolean;
  
  /** Callback para o botão 'Novo' */
  onNew?: () => void;
  
  /** Desabilitar botão 'Importar' */
  disableImportButton?: boolean;
  
  /** Callback para o botão 'Importar' */
  onImport?: () => void;
  
  /** Desabilitar botão 'Exportar' */
  disableExportButton?: boolean;
  
  /** Callback para o botão 'Exportar' */
  onExport?: () => void;
  
  /** Mostrar botão de ajuda */
  showHelpButton?: boolean;
  
  /** Callback para o botão de ajuda */
  onHelp?: () => void;
  
  /** Ações personalizadas adicionais */
  extraActions?: React.ReactNode;
}

/**
 * Componente para ações padrão de cabeçalho de página
 * Inclui botões como Novo, Importar, Exportar e Ajuda
 */
export const PageHeaderActions: React.FC<PageHeaderActionProps> = ({
  pageId,
  newButtonText = 'Novo',
  disableNewButton = false,
  onNew,
  disableImportButton = false,
  onImport,
  disableExportButton = false,
  onExport,
  showHelpButton = false,
  onHelp,
  extraActions
}) => {
  // Manipuladores de eventos com logging
  const handleNew = () => {
    logger.userAction('new_button_clicked', { page: pageId });
    onNew?.();
  };
  
  const handleImport = () => {
    logger.userAction('import_button_clicked', { page: pageId });
    onImport?.();
  };
  
  const handleExport = () => {
    logger.userAction('export_button_clicked', { page: pageId });
    onExport?.();
  };
  
  const handleHelp = () => {
    logger.userAction('help_button_clicked', { page: pageId });
    onHelp?.();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Ações padrão */}
      {!disableNewButton && onNew && (
        <Button 
          onClick={handleNew}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          {newButtonText}
        </Button>
      )}
      
      {!disableImportButton && onImport && (
        <Button 
          variant="outline" 
          onClick={handleImport}
        >
          <Upload className="mr-2 h-4 w-4" />
          Importar
        </Button>
      )}
      
      {!disableExportButton && onExport && (
        <Button 
          variant="outline" 
          onClick={handleExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      )}
      
      {showHelpButton && onHelp && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleHelp}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      )}
      
      {/* Ações personalizadas adicionais */}
      {extraActions}
    </div>
  );
};

export default PageHeaderActions;