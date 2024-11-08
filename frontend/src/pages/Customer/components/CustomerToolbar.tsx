import { Download, HelpCircle, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerToolbarProps {
  onExport: () => void;
  onImport: () => void;
  onHelpClick: () => void;
  onNewCustomer: () => void;
}

const CustomerToolbar = ({
  onExport,
  onImport,
  onHelpClick,
  onNewCustomer
}: CustomerToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Grupo de botões de importação/exportação */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onExport}
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>

        <Button
          variant="outline"
          onClick={onImport}
          className="flex items-center"
        >
          <Upload className="mr-2 h-4 w-4" />
          Importar
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onHelpClick}
          className="flex items-center"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

      {/* Botão Novo Cliente separado à direita */}
      <Button
        onClick={onNewCustomer}
        className="flex items-center"
      >
        <Plus className="mr-2 h-4 w-4" />
        Novo Cliente
      </Button>
    </div>
  );
};

export {
    CustomerToolbar
};