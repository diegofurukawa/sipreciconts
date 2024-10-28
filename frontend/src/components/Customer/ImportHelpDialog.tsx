interface ImportHelpDialogProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const ImportHelpDialog = ({ isOpen, onClose }: ImportHelpDialogProps) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Ajuda para Importação</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Fechar</span>
              ×
            </button>
          </div>
          
          <div className="prose prose-sm">
            <h3>Formato do Arquivo CSV</h3>
            <p>O arquivo CSV deve conter as seguintes colunas:</p>
            <ul>
              <li><strong>Nome*</strong> - Nome do cliente</li>
              <li><strong>Documento</strong> - CPF ou CNPJ do cliente</li>
              <li><strong>Celular*</strong> - Número de celular</li>
              <li><strong>Email</strong> - Endereço de email</li>
              <li><strong>Endereço</strong> - Endereço completo</li>
              <li><strong>Complemento</strong> - Complemento do endereço</li>
            </ul>
            <p className="text-sm text-gray-500">* Campos obrigatórios</p>
  
            <h3 className="mt-4">Regras e Limitações</h3>
            <ul>
              <li>Tamanho máximo do arquivo: 5MB</li>
              <li>Formato aceito: apenas CSV</li>
              <li>Codificação: UTF-8</li>
              <li>Separador: vírgula (,)</li>
            </ul>
  
            <h3 className="mt-4">Exemplo de Arquivo</h3>
            <pre className="bg-gray-50 p-3 rounded-md text-xs">
              Nome,Documento,Celular,Email,Endereço,Complemento{'\n'}
              João Silva,123.456.789-00,11999887766,joao@email.com,Rua A 123,Apto 1{'\n'}
              Maria Santos,987.654.321-00,11988776655,maria@email.com,Av B 456,Sala 2
            </pre>
  
            <h3 className="mt-4">Dicas</h3>
            <ul>
              <li>Verifique se todos os campos obrigatórios estão preenchidos</li>
              <li>Remova quaisquer caracteres especiais ou formatação do documento</li>
              <li>Certifique-se de que os números de telefone contêm apenas números</li>
              <li>Emails devem ser válidos e conter @</li>
            </ul>
          </div>
  
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ImportHelpDialog;