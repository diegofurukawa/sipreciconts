import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Pencil, Trash2 } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { TablePagination } from '@/components/ui/table-pagination';
import { taxService } from '../services/TaxService';
import { useToast } from '@/hooks/useToast';
import { useTaxList } from '../hooks/useTaxList';

export const TaxList = () => {
  const { 
    taxes, 
    loading, 
    error, 
    totalPages,
    currentPage,
    handlePageChange,
    handleDelete, 
    handleExport,
    handleImport,
    refresh
  } = useTaxList();
  
  const [deleteDialog, setDeleteDialog] = useState<{show: boolean; id?: number}>({show: false});
  const { showToast } = useToast();
  
  const confirmDelete = async () => {
    if (deleteDialog.id) {
      await handleDelete(deleteDialog.id);
      setDeleteDialog({show: false});
    }
  };

  const handleNew = () => {
    window.location.href = '/cadastros/impostos/novo';
  };

  const handleEdit = (id: number) => {
    window.location.href = `/cadastros/impostos/${id}/editar`;
  };

  // Formatação e utilitários
  const formatTaxValue = (value: number, calcOperator: string): string => {
    if (value == null) return '0.00';
    const formatted = value.toFixed(2);
    return calcOperator === '%' ? `${formatted}%` : formatted;
  };

  const getOptionLabel = (value: string, options: { value: string; label: string }[]): string => {
    return options.find(option => option.value === value)?.label || value;
  };

  // Opções para selects
  const TAX_TYPES = [
    { value: 'tax', label: 'Imposto' },
    { value: 'fee', label: 'Taxa' }
  ];

  const TAX_GROUPS = [
    { value: 'federal', label: 'Federal' },
    { value: 'state', label: 'Estadual' },
    { value: 'municipal', label: 'Municipal' },
    { value: 'other', label: 'Outro' }
  ];

  const CALC_OPERATORS = [
    { value: '%', label: 'Percentual' },
    { value: '0', label: 'Fixo' },
    { value: '+', label: 'Adição' },
    { value: '-', label: 'Subtração' },
    { value: '*', label: 'Multiplicação' },
    { value: '/', label: 'Divisão' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Impostos e Taxas</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie os impostos cadastrados no sistema</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleNew}
                className="inline-flex items-center px-4 py-2 border border-transparent 
                           text-sm font-medium rounded-md shadow-sm text-white 
                           bg-emerald-600 hover:bg-emerald-700 focus:outline-none 
                           focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Imposto
              </button>
              <button 
                onClick={handleImport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 
                          text-sm font-medium rounded-md text-gray-700 bg-white 
                          hover:bg-gray-50 focus:outline-none focus:ring-2 
                          focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </button>
              <button 
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 
                          text-sm font-medium rounded-md text-gray-700 bg-white 
                          hover:bg-gray-50 focus:outline-none focus:ring-2 
                          focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-2">
                <button 
                  className="text-sm text-red-700 font-medium hover:text-red-600"
                  onClick={() => refresh()}
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Impostos */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sigla
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operador
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxes.length > 0 ? (
                taxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">{tax.acronym}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOptionLabel(tax.type, TAX_TYPES)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOptionLabel(tax.group, TAX_GROUPS)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOptionLabel(tax.calc_operator, CALC_OPERATORS)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatTaxValue(tax.value, tax.calc_operator)}
                    </td>
                    <td className="px-6 py-4">{tax.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(tax.id!)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="inline h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ show: true, id: tax.id })}
                        className="text-red-600 hover:text-red-900 ml-3"
                      >
                        <Trash2 className="inline h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nenhum imposto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {taxes.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialog.show}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este imposto?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialog({show: false})}>
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

export default TaxList;