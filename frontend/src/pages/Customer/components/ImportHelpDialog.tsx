import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImportHelpDialogProps {
  open: boolean;
  onClose: () => void;
}

const ImportHelpDialog = ({ open, onClose }: ImportHelpDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Ajuda para Importação</DialogTitle>
          <DialogDescription>
            Para importar clientes, seu arquivo CSV deve seguir o seguinte formato:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Campos obrigatórios:</h4>
            <ul className="list-disc list-inside mt-2">
              <li>Nome</li>
              <li>Celular</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Campos opcionais:</h4>
            <ul className="list-disc list-inside mt-2">
              <li>Documento</li>
              <li>Tipo de Cliente</li>
              <li>Email</li>
              <li>Endereço</li>
              <li>Complemento</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Exemplo de arquivo:</h4>
            <div className="relative">
              <div className="overflow-x-auto">
                <pre className="bg-gray-100 p-3 rounded-md text-sm whitespace-pre-wrap break-all">
                  Nome;Documento;Tipo de Cliente;Celular;Email;Endereço;Complemento
                  João Silva;123.456.789-00;Individual;11999887766;joao@email.com;Rua A;Apto 123
                  Maria Santos;987.654.321-00;Empresarial;11988776655;maria@empresa.com;Av B;Sala 456
                </pre>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export {
  ImportHelpDialog
};