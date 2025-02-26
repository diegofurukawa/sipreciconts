import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from 'react';
import { Pencil, Trash, Eye, Plus, Search, X, Download, Upload } from 'lucide-react';

// Componente principal de listagem de clientes
const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerToDelete, setCustomerToDelete] = useState(null);
  
  // Estado para feedback visual ao usuário
  const [feedback, setFeedback] = useState(null);

  // Buscar dados de clientes (mock para demonstração)
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Em uma implementação real, isso seria uma chamada à API
        
        // Dados de exemplo para demonstração
        const mockCustomers = [
          { 
            customer_id: 1, 
            name: 'Empresa ABC Ltda', 
            document: '12.345.678/0001-90', 
            celphone: '(11) 98765-4321', 
            email: 'contato@empresaabc.com.br' 
          },
          { 
            customer_id: 2, 
            name: 'João Silva', 
            document: '123.456.789-00', 
            celphone: '(11) 91234-5678', 
            email: 'joao.silva@email.com' 
          },
          { 
            customer_id: 3, 
            name: 'Mercado Express', 
            document: '87.654.321/0001-43', 
            celphone: '(11) 97654-3210', 
            email: 'contato@mercadoexpress.com' 
          }
        ];
        
        setCustomers(mockCustomers);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        showFeedback('error', 'Erro ao carregar lista de clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Funções de manipulação
  const handleSearch = () => {
    // Implementar busca em uma aplicação real
    console.log('Buscando por:', searchTerm);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    // Em uma aplicação real, recarregaria a lista completa
  };

  const confirmDelete = async (id) => {
    try {
      // Em uma implementação real, isso seria uma chamada à API
      // await customerService.delete(id);
      
      // Remove o cliente do estado para simular exclusão
      setCustomers(customers.filter(c => c.customer_id !== id));
      showFeedback('success', 'Cliente excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      showFeedback('error', 'Erro ao excluir cliente');
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Renderização principal
  return (
    <div className="p-4">
      {/* Feedback visual */}
      {feedback && (
        <div 
          className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg text-white
            ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {feedback.message}
        </div>
      )}
      
      {/* Cabeçalho com busca e ações */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Pesquisar clientes..."
            className="w-full pl-8 pr-4 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          {searchTerm && (
            <button
              className="absolute right-2 top-2.5"
              onClick={handleSearchClear}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="flex items-center px-3 py-2 bg-white border rounded hover:bg-gray-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </button>

          <button
            className="flex items-center px-3 py-2 bg-white border rounded hover:bg-gray-50"
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </button>

          <button
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Tabela de clientes */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Celular</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <p className="text-gray-500">Nenhum cliente encontrado</p>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.document || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.celphone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="inline h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 ml-2">
                      <Pencil className="inline h-4 w-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 ml-2"
                      onClick={() => confirmDelete(customer.customer_id)}
                    >
                      <Trash className="inline h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;