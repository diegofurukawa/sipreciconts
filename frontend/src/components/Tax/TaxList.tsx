import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { TablePagination } from '../../components/ui/TablePagination';
import { Tax } from '../../types/tax';
import { TaxService } from '../../services/api';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface TaxFormData {
  acronym: string;
  description: string;
  type: string;
  group: string;
  calc_operator: string;
  value: string;
}

// Opções estáticas baseadas no backend
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

const TaxList = () => {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ show: boolean; id?: number }>({ show: false });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState<TaxFormData>({
    acronym: '',
    description: '',
    type: '',
    group: '',
    calc_operator: '%',
    value: ''
  });

  const loadTaxes = async (page = 1) => {
    try {
      setLoading(true);
      const response = await TaxService.list(page);
      setTaxes(response.results);
      setTotalPages(Math.ceil(response.count / 10)); // 10 itens por página
      setCurrentPage(page);
    } catch (error) {
      console.error('Erro ao carregar impostos:', error);
      showFeedback('error', 'Erro ao carregar impostos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaxes();
  }, []);

  const handlePageChange = (page: number) => {
    loadTaxes(page);
  };

  const handleNew = () => {
    setSelectedTax(null);
    setFormData({
      acronym: '',
      description: '',
      type: '',
      group: '',
      calc_operator: '%',
      value: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (tax: Tax) => {
    setSelectedTax(tax);
    setFormData({
      acronym: tax.acronym,
      description: tax.description || '',
      type: tax.type,
      group: tax.group,
      calc_operator: tax.calc_operator,
      value: tax.value.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteAlert({ show: true, id });
  };

  const confirmDelete = async () => {
    if (deleteAlert.id) {
      try {
        await TaxService.delete(deleteAlert.id);
        showFeedback('success', 'Imposto excluído com sucesso');
        await loadTaxes(currentPage);
      } catch (error) {
        console.error('Erro ao excluir imposto:', error);
        showFeedback('error', 'Erro ao excluir imposto');
      }
    }
    setDeleteAlert({ show: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taxData = {
        ...formData,
        value: parseFloat(formData.value)
      };

      if (selectedTax?.id) {
        await TaxService.update(selectedTax.id, taxData);
        showFeedback('success', 'Imposto atualizado com sucesso');
      } else {
        await TaxService.create(taxData);
        showFeedback('success', 'Imposto criado com sucesso');
      }

      setIsModalOpen(false);
      await loadTaxes(currentPage);
    } catch (error) {
      console.error('Erro ao salvar imposto:', error);
      showFeedback('error', 'Erro ao salvar imposto');
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const formatTaxValue = (value: any, calcOperator: string): string => {
    if (value == null) return '0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (typeof numValue !== 'number' || isNaN(numValue)) {
      return '0.00';
    }
    const formatted = numValue.toFixed(2);
    return calcOperator === '%' ? `${formatted}%` : formatted;
  };

  const getOptionLabel = (value: string, options: { value: string; label: string }[]): string => {
    return options.find(option => option.value === value)?.label || value;
  };

  if (loading) {
    return (
      <MainLayout title="Impostos e Taxas">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Impostos e Taxas" 
      subtitle="Gerencie os impostos e taxas do sistema"
    >
      {feedback && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
            feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white z-50`}
        >
          {feedback.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Lista de Impostos
            </h2>
            <button
              onClick={handleNew}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center gap-2"
            >
              <Plus size={20} />
              Novo Imposto
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sigla
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxes.map((tax) => (
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
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(tax)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="inline h-5 w-5" />
                    </button>
                    <button
                      onClick={() => tax.id && handleDelete(tax.id)}
                      className="text-red-600 hover:text-red-900 ml-3"
                    >
                      <Trash2 className="inline h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal de Formulário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedTax ? 'Editar Imposto' : 'Novo Imposto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sigla *
                </label>
                <input
                  type="text"
                  required
                  value={formData.acronym}
                  onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Selecione um tipo</option>
                  {TAX_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo *
                </label>
                <select
                  required
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Selecione um grupo</option>
                  {TAX_GROUPS.map(group => (
                    <option key={group.value} value={group.value}>{group.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operador de Cálculo *
                </label>
                <select
                  required
                  value={formData.calc_operator}
                  onChange={(e) => setFormData({ ...formData, calc_operator: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {CALC_OPERATORS.map(operator => (
                    <option key={operator.value} value={operator.value}>{operator.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={deleteAlert.show}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este imposto?
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
    </MainLayout>
  );
};

export { TaxList };    
export default TaxList;                  