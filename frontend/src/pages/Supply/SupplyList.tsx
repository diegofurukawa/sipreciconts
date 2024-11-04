// src/components/Supply/SupplyList.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Supply } from '../../types/supply';
import { SupplyService } from '../../services/api/supply';
import { SupplyForm } from '@/components/Supply';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog/alert-dialog';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

const SupplyList: React.FC = () => {
  // Estados
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ show: boolean; id?: number }>({ show: false });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Efeitos
  useEffect(() => {
    loadSupplies(pagination.currentPage);
  }, [pagination.currentPage]);

  // Funções
  const loadSupplies = async (page: number) => {
    try {
      setLoading(true);
      const response = await SupplyService.list(page, pagination.pageSize);
      setSupplies(response.results);
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(response.count / pagination.pageSize),
        pageSize: pagination.pageSize,
        totalItems: response.count
      });
    } catch (error) {
      console.error('Erro ao carregar insumos:', error);
      showFeedback('error', 'Erro ao carregar insumos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supply: Supply) => {
    setSelectedSupply(supply);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedSupply(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setDeleteAlert({ show: true, id });
  };

  const confirmDelete = async () => {
    if (deleteAlert.id) {
      try {
        await SupplyService.delete(deleteAlert.id);
        showFeedback('success', 'Insumo excluído com sucesso');
        await loadSupplies(pagination.currentPage);
      } catch (error) {
        console.error('Erro ao excluir insumo:', error);
        showFeedback('error', 'Erro ao excluir insumo');
      }
    }
    setDeleteAlert({ show: false });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await SupplyService.import(file);
        showFeedback('success', 'Insumos importados com sucesso');
        await loadSupplies(1); // Volta para a primeira página após importação
      } catch (error) {
        console.error('Erro ao importar insumos:', error);
        showFeedback('error', 'Erro ao importar insumos');
      }
    }
  };

  const handleExport = async () => {
    try {
      await SupplyService.export();
      showFeedback('success', 'Dados exportados com sucesso');
    } catch (error) {
      console.error('Erro ao exportar insumos:', error);
      showFeedback('error', 'Erro ao exportar insumos');
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    await loadSupplies(pagination.currentPage);
    showFeedback('success', `Insumo ${selectedSupply ? 'atualizado' : 'criado'} com sucesso`);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    try {
      const response = await SupplyService.search(value);
      setSupplies(response.results);
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        totalItems: response.count,
        totalPages: Math.ceil(response.count / prev.pageSize)
      }));
    } catch (error) {
      console.error('Erro ao pesquisar insumos:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Componente de Paginação
  const PaginationControls = () => {
    const pages = [];
    let startPage = Math.max(1, pagination.currentPage - 2);
    let endPage = Math.min(pagination.totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
              ${pagination.currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}
          >
            Anterior
          </button>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
              ${pagination.currentPage === pagination.totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}
          >
            Próximo
          </button>
        </div>
        
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">
                {((pagination.currentPage - 1) * pagination.pageSize) + 1}
              </span>{' '}
              até{' '}
              <span className="font-medium">
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
              </span>{' '}
              de{' '}
              <span className="font-medium">{pagination.totalItems}</span>{' '}
              resultados
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={pagination.currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 
                  ${pagination.currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 
                  ${pagination.currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {pages.map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium
                    ${page === pagination.currentPage
                      ? 'z-10 bg-emerald-600 text-white'
                      : 'bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`relative inline-flex items-center px-2 py-2 
                  ${pagination.currentPage === pagination.totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 
                  ${pagination.currentPage === pagination.totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  // Renderização condicional para loading
  if (loading && supplies.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Renderização principal
  return (
    <div className="container mx-auto p-4">
      {/* Feedback */}
      {feedback && (
        <div className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
          feedback.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        } text-white z-50`}>
          {feedback.message}
        </div>
      )}

      {/* Cabeçalho com Ações */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Buscar insumos..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="space-x-2">
          <button
            onClick={handleNew}
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
          >
            Novo Insumo
          </button>
          <button
            onClick={() => document.getElementById('importInput')?.click()}
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
          >
            Importar
          </button>
          <input
            id="importInput"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={handleExport}
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
          >
            Exportar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apelido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código EAN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Un. Medida</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {supplies.map((supply) => (
              <tr key={supply.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{supply.name}</td>
                <td className="px-6 py-4">{supply.nick_name || '-'}</td>
                <td className="px-6 py-4">{supply.ean_code || '-'}</td>
                <td className="px-6 py-4">{supply.type_display}</td>
                <td className="px-6 py-4">{supply.unit_measure_display}</td>
                <td className="px-6 py-4 space-x-2">
                <button
                    onClick={() => handleEdit(supply)}
                    className="text-emerald-600 hover:text-emerald-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => supply.id && handleDelete(supply.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mensagem quando não há dados */}
        {supplies.length === 0 && !loading && (
          <div className="text-center py-4 text-gray-500">
            Nenhum insumo encontrado
          </div>
        )}

        {/* Paginação */}
        {supplies.length > 0 && <PaginationControls />}
      </div>

      {/* Modal de Formulário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedSupply ? 'Editar Insumo' : 'Novo Insumo'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <SupplyForm
              supply={selectedSupply}
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
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este insumo?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteAlert({ show: false })}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export{
  SupplyList
};