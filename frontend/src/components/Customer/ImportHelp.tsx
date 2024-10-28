import React from 'react';

interface ImportHelpDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const ImportHelpDialog: React.FC<ImportHelpDialogProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Guia de Importação de Clientes</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
                </div>
                
                <div className="space-y-6">
                    <section>
                        <h3 className="font-bold text-lg mb-2">Formato do Arquivo</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>O arquivo deve estar no formato CSV</li>
                            <li>Use vírgula (;) como separador</li>
                            <li>A primeira linha deve conter os cabeçalhos</li>
                            <li>Codificação recomendada: UTF-8</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg mb-2">Estrutura das Colunas</h3>
                        <div className="bg-gray-100 p-4 rounded">
                            <p className="font-mono">Nome,Documento,Tipo de Cliente,Celular,Email,Endereço,Complemento</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg mb-2">Exemplo de Conteúdo</h3>
                        <div className="bg-gray-100 p-4 rounded overflow-x-auto">
                            <pre className="font-mono text-sm">
{`Nome,Documento,Tipo de Cliente,Celular,Email,Endereço,Complemento
João Silva,123.456.789-00,Individual,(11) 98765-4321,joao.silva@email.com,Rua das Flores 123,Apto 42
Maria Oliveira,987.654.321-00,Empresarial,(11) 97654-3210,maria.oliveira@empresa.com,Avenida Paulista 1000,Sala 505
Pedro Santos,456.789.123-00,Individual,(31) 98765-4321,pedro.santos@example.com,Rua das Palmeiras 789,Casa 2`}
                            </pre>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg mb-2">Informações Importantes</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>O sistema irá limpar automaticamente caracteres especiais do documento e telefone</li>
                            <li>Clientes com mesmo documento serão atualizados em vez de duplicados</li>
                            <li>Campos vazios devem ser mantidos (ex: ,,)</li>
                            <li>Tipo de Cliente pode ser 'Física', 'Jurídica', 'Individual' ou 'Empresarial'</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg mb-2">Possíveis Erros</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Cabeçalhos incorretos ou faltando</li>
                            <li>Formato de email inválido</li>
                            <li>Telefones em formato inválido</li>
                            <li>Documentos duplicados (serão atualizados)</li>
                        </ul>
                    </section>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportHelpDialog;