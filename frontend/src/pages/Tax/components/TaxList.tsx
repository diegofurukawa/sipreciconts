// src/pages/Tax/TaxList.tsx
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Download, 
  Upload, 
  Search, 
  X,
  AlertCircle
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { TablePagination } from '@/components/ui/table-pagination';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TaxForm } from '@/pages/Tax/components/TaxForm';
import { useTaxList } from '@/pages/Tax/hooks/useTaxList';
import { Tax } from '@/services/api/modules/Tax';

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

const TaxList: React.FC = () => {
  // Custom hook
  const {
    taxes,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    searchTerm,
    handleSearch,
    handlePageChange,
    handleDelete,
    handleExport,
    handleImport,
    fetchTaxes
  } = useTaxList();

  // Local state
  const [deleteDialogId, setDeleteDialogId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Helper functions
  const openNewForm = () => {
    setSelectedTax(null);
    setShowForm(true);
  };

  const openEditForm = (tax: Tax) => {
    setSelectedTax(tax);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedTax(null);
  };

  const confirmDelete = (id: number) => {
    setDeleteDialogId(id);
  };

  const performDelete = async () => {
    if (deleteDialogId !== null) {
      await handleDelete(deleteDialogId);
      setDeleteDialogId(null);
    }
  };

  const performSearch = () => {
    handleSearch(localSearchTerm);
  };

  const clearSearch = () => {
    setLocalSearchTerm('');
    handleSearch('');
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        handleImport(file);
      }
    };
    input.click();
  };

  const handleExportClick = async () => {
    const blob = await handleExport();
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'impostos.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleFormSuccess = () => {
    closeForm();
    fetchTaxes();
  };

  // Helper: Get label from value
  const getOptionLabel = (value: string, options: { value: string; label: string }[]): string => {
    return options.find(option => option.value === value)?.label || value;
  };

  // Helper: Format tax value
  const formatTaxValue = (value: any, calcOperator: string): string => {
    if (value == null) return '0,00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (typeof numValue !== 'number' || isNaN(numValue)) {
      return '0,00';
    }
    
    const formatted = numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return calcOperator === '%' ? `${formatted}%` : formatted;
  };

  // Loading state
  if (loading && taxes.length === 0) {
    return (
      <MainLayout title="Impostos e Taxas">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Impostos e Taxas" 
      subtitle="Gerencie os impostos e taxas do sistema"
    >
      {/* Container */}
      <div className="space-y-6">
        {/* Header card with actions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Lista de Impostos</CardTitle>
                <CardDescription>
                  {taxes.length > 0 
                    ? `Mostrando ${taxes.length} de ${totalItems} impostos` 
                    : 'Nenhum imposto encontrado'}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={openNewForm}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Imposto
                </button>
                <button 
                  onClick={handleImportClick}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </button>
                <button 
                  onClick={handleExportClick}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Search bar */}
            <div className="relative w-full sm:w-96 mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-2.5"
                placeholder="Buscar por sigla ou descrição..."
              />
              {localSearchTerm && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={clearSearch}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <div className="mt-2">
                  <button 
                    className="text-sm text-red-700 font-medium hover:text-red-600"
                    onClick={() => fetchTaxes()}
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sigla</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operador</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taxes.length > 0 ? (
                    taxes.map((tax) => (
                      <tr key={tax.id} className="hover:bg-gray-50">
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
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            onClick={() => openEditForm(tax)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Pencil className="inline h-5 w-5" />
                          </button>
                          <button
                            onClick={() => tax.id && confirmDelete(tax.id)}
                            className="text-red-600 hover:text-red-900 ml-3"
                            title="Excluir"
                          >
                            <Trash2 className="inline h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                        {searchTerm ? 'Nenhum resultado encontrado para sua busca' : 'Nenhum imposto cadastrado. Clique em "Novo Imposto" para começar.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {taxes.length > 0 && (
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tax Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedTax ? 'Editar Imposto' : 'Novo Imposto'}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <TaxForm 
              tax={selectedTax}
              onSuccess={handleFormSuccess}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogId !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este imposto?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={performDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default TaxList;