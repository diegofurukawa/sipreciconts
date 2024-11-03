import { useState } from 'react';
import { Plus, Search, Download, Upload, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomerForm } from './CustomerForm';
import { DeleteConfirmation } from './DeleteConfirmation';
import { ImportHelpDialog } from './ImportHelpDialog';
import { FeedbackMessage } from './FeedbackMessage';
import { useCustomerList } from '../hooks/useCustomerList';
import type { Customer } from '../types';

const CustomerList = () => {
  // Estados locais
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
  const [showImportHelp, setShowImportHelp] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Hook customizado para lógica de negócio
  const { 
    customers,
    loading,
    handleDelete,
    handleImport,
    handleExport,
    reloadCustomers
  } = useCustomerList();

  // Filtro de clientes
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.document?.toLowerCase().includes(search.toLowerCase()) ||
    customer.celphone.includes(search) ||
    customer.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await handleImport(file);
        showFeedback('success', 'Clientes importados com sucesso');
      } catch (error) {
        showFeedback('error', 'Erro ao importar clientes');
      }
    }
  };

  const handleExportClick = async () => {
    try {
      await handleExport();
      showFeedback('success', 'Arquivo exportado com sucesso');
    } catch (error) {
      showFeedback('error', 'Erro ao exportar clientes');
    }
  };

  const handleDeleteClick = async (id: number) => {
    setCustomerToDelete(id);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await handleDelete(customerToDelete);
        showFeedback('success', 'Cliente excluído com sucesso');
      } catch (error) {
        showFeedback('error', 'Erro ao excluir cliente');
      }
      setCustomerToDelete(null);
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-6">
          {/* Cabeçalho com pesquisa e ações */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Pesquisar clientes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={handleExportClick}
              >
                <Download size={20} className="mr-2" />
                Exportar
              </Button>
              
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('importInput')?.click()}
                >
                  <Upload size={20} className="mr-2" />
                  Importar
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-10 top-0"
                  onClick={() => setShowImportHelp(true)}
                >
                  <HelpCircle size={20} />
                </Button>
                <input
                  id="importInput"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              
              <Button
                onClick={() => setSelectedCustomer({})}
              >
                <Plus size={20} className="mr-2" />
                Novo Cliente
              </Button>
            </div>
          </div>

          {/* Tabela de clientes */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Nome</th>
                    <th className="text-left p-4 font-medium">Documento</th>
                    <th className="text-left p-4 font-medium">Celular</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-right p-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr 
                      key={customer.customer_id} 
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="p-4">{customer.name}</td>
                      <td className="p-4">{customer.document || '-'}</td>
                      <td className="p-4">{customer.celphone}</td>
                      <td className="p-4">{customer.email || '-'}</td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => customer.customer_id && handleDeleteClick(customer.customer_id)}
                        >
                          Excluir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de formulário */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CustomerForm
              customer={selectedCustomer.customer_id ? selectedCustomer : undefined}
              onSuccess={() => {
                setSelectedCustomer(null);
                reloadCustomers();
                showFeedback('success', `Cliente ${selectedCustomer.customer_id ? 'atualizado' : 'criado'} com sucesso`);
              }}
              onCancel={() => setSelectedCustomer(null)}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      <DeleteConfirmation
        open={customerToDelete !== null}
        onConfirm={confirmDelete}
        onCancel={() => setCustomerToDelete(null)}
      />

      {/* Modal de ajuda para importação */}
      <ImportHelpDialog
        open={showImportHelp}
        onClose={() => setShowImportHelp(false)}
      />

      {/* Mensagem de feedback */}
      {feedback && (
        <FeedbackMessage
          type={feedback.type}
          message={feedback.message}
        />
      )}
    </>
  );
};

export {
  CustomerList
};