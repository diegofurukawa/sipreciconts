import React, { useState, useEffect } from 'react';
import { Customer } from '../../types/customer';
import { CustomerService } from '../../services/api';
import CustomerForm from './CustomerForm';
import ImportHelpDialog from './ImportHelp';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '../../components/ui/alert-dialog';

const CustomerList: React.FC = () => {
  // Estados
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ show: boolean; id?: number }>({ show: false });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showImportHelp, setShowImportHelp] = useState(false);
  
  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    loadCustomers(currentPage);
  }, [currentPage]);

  const loadCustomers = async (page: number) => {
    try {
      setLoading(true);
      const response = await CustomerService.list(page);
      
      console.log('API Response:', response);
      
      setCustomers(response.results || []);
      const total = Number(response.count) || 0;
      setTotalCustomers(total);
      const calculatedPages = Math.max(1, Math.ceil(total / itemsPerPage));
      setTotalPages(calculatedPages);

    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      showFeedback('error', 'Erro ao carregar clientes');
      setCustomers([]);
      setTotalCustomers(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteAlert({ show: true, id });
  };

  const confirmDelete = async () => {
    if (deleteAlert.id) {
      try {
        await CustomerService.delete(deleteAlert.id);
        showFeedback('success', 'Cliente excluído com sucesso');
        await loadCustomers(currentPage);
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        showFeedback('error', 'Erro ao excluir cliente');
      }
    }
    setDeleteAlert({ show: false });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        showFeedback('error', 'Por favor, selecione um arquivo CSV válido');
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showFeedback('error', 'O arquivo é muito grande. Tamanho máximo: 5MB');
        return;
      }

      const result = await CustomerService.import(file);
      showFeedback('success', result.message || 'Clientes importados com sucesso');
      await loadCustomers(1);
      setCurrentPage(1);

      if (result.errors && result.errors.length > 0) {
        console.log('Erros na importação:', result.errors);
      }
    } catch (error: any) {
      console.error('Erro ao importar clientes:', error);
      showFeedback('error', error.message || 'Erro ao importar clientes');
    }

    event.target.value = '';
  };

  const handleExport = async () => {
    try {
      await CustomerService.export();
      showFeedback('success', 'Dados exportados com sucesso');
    } catch (error: any) {
      console.error('Erro ao exportar clientes:', error);
      showFeedback('error', error.message || 'Erro ao exportar clientes');
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    await loadCustomers(currentPage);
    showFeedback('success', `Cliente ${selectedCustomer ? 'atualizado' : 'criado'} com sucesso`);
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-white shadow-lg rounded-lg">
      {/* Feedback */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {feedback.message}
        </div>
      )}

      {/* Cabeçalho */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie seus clientes, importações e exportações
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleNew}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Novo Cliente
            </button>
            <div className="relative">
              <label
                htmlFor="importInput"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
              >
                Importar
              </label>
              <button
                onClick={() => setShowImportHelp(true)}
                className="absolute -right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Ajuda para importação"
              >
                ?
              </button>
              <input
                id="importInput"
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Celular
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.document || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.celphone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => customer.id && handleDelete(customer.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalCustomers > 0 && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> até{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalCustomers)}
              </span> de{' '}
              <span className="font-medium">{totalCustomers}</span> resultados
            </p>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage <= 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Anterior
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage >= totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Próximo
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Modal de Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCustomer ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fechar</span>
                ×
              </button>
            </div>
            <CustomerForm
              customer={selectedCustomer}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
{/* Modal de Confirmação de Exclusão */}
<AlertDialog open={deleteAlert.show}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500">
              Tem certeza que deseja excluir este cliente?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setDeleteAlert({ show: false })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="ml-3 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Ajuda para Importação */}
      <ImportHelpDialog 
        isOpen={showImportHelp}
        onClose={() => setShowImportHelp(false)}
      />
    </div>
  );
};

export default CustomerList;