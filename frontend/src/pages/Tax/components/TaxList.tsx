// src/pages/Tax/components/TaxList.tsx
import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../../layouts/MainLayout';
import { TablePagination } from '../../../components/ui/table-pagination';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { TaxForm } from '../components/TaxForm';

// Definição da interface Tax
export interface Tax {
  id?: number;
  acronym: string;
  description: string;
  type: string;
  group: string;
  calc_operator: string;
  value: number;
}

// Mock de dados para teste
const TAX_MOCK_DATA: Tax[] = [
  { 
    id: 1, 
    acronym: 'ICMS', 
    description: 'Imposto sobre Circulação de Mercadorias e Serviços', 
    type: 'tax', 
    group: 'state', 
    calc_operator: '%', 
    value: 18 
  },
  { 
    id: 2, 
    acronym: 'ISS', 
    description: 'Imposto Sobre Serviços', 
    type: 'tax', 
    group: 'municipal', 
    calc_operator: '%', 
    value: 5 
  },
  { 
    id: 3, 
    acronym: 'IPI', 
    description: 'Imposto sobre Produtos Industrializados', 
    type: 'tax', 
    group: 'federal', 
    calc_operator: '%', 
    value: 10 
  }
];

// Opções estáticas para os selects
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
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ show: boolean; id?: number }>({ show: false });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Simulação de carregamento de dados da API
  useEffect(() => {
    const timer = setTimeout(() => {
      setTaxes(TAX_MOCK_DATA);
      setLoading(false);
      setTotalPages(Math.ceil(TAX_MOCK_DATA.length / 5)); // 5 itens por página para demonstração
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Funções de manipulação CRUD
  const handleNew = () => {
    setSelectedTax(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tax: Tax) => {
    setSelectedTax(tax);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteAlert({ show: true, id });
  };

  const confirmDelete = async () => {
    if (deleteAlert.id) {
      try {
        // Em uma implementação real, chamaríamos a API de deleção
        // await TaxService.delete(deleteAlert.id);
        
        // Simulando exclusão local para demonstração
        setTaxes(prevTaxes => prevTaxes.filter(tax => tax.id !== deleteAlert.id));
        
        showFeedback('success', 'Imposto excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir imposto:', error);
        showFeedback('error', 'Erro ao excluir imposto');
      }
    }
    setDeleteAlert({ show: false });
  };

  const handleFormSubmit = async (formData: Tax) => {
    try {
      if (selectedTax && selectedTax.id) {
        // Atualizar existente
        const updatedTaxes = taxes.map(tax => 
          tax.id === selectedTax.id ? { ...formData, id: selectedTax.id } : tax
        );
        setTaxes(updatedTaxes);
        showFeedback('success', 'Imposto atualizado com sucesso');
      } else {
        // Criar novo
        const newTax = { 
          ...formData, 
          id: Math.max(0, ...taxes.map(tax => tax.id || 0)) + 1 
        };
        setTaxes([...taxes, newTax]);
        showFeedback('success', 'Imposto criado com sucesso');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar imposto:', error);
      showFeedback('error', 'Erro ao salvar imposto');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Em uma implementação real, carregaríamos a página correspondente da API
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Auxiliares de formatação
  const formatTaxValue = (value: number, calcOperator: string): string => {
    if (value == null) return '0.00';
    const formatted = value.toFixed(2);
    return calcOperator === '%' ? `${formatted}%` : formatted;
  };

  const getOptionLabel = (value: string, options: { value: string; label: string }[]): string => {
    return options.find(option => option.value === value)?.label || value;
  };

  // Render do componente
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
      {/* Feedback visual */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
            feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white z-50`}
        >
          {feedback.message}
        </div>
      )}

      {/* Cabeçalho e ações */}
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

        {/* Tabela de impostos */}
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
              {taxes.length === 0 && (
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
            <TaxFormSimplified
              tax={selectedTax}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
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

// Componente de formulário simplificado (sem react-hook-form para reduzir dependências)
interface TaxFormSimplifiedProps {
  tax: Tax | null;
  onSubmit: (tax: Tax) => void;
  onCancel: () => void;
}

const TaxFormSimplified: React.FC<TaxFormSimplifiedProps> = ({ tax, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Tax>({
    acronym: tax?.acronym || '',
    description: tax?.description || '',
    type: tax?.type || 'tax',
    group: tax?.group || 'federal',
    calc_operator: tax?.calc_operator || '%',
    value: tax?.value || 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sigla *
        </label>
        <input
          type="text"
          name="acronym"
          required
          value={formData.acronym}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo *
        </label>
        <select
          name="type"
          required
          value={formData.type}
          onChange={handleChange}
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
          name="group"
          required
          value={formData.group}
          onChange={handleChange}
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
          name="calc_operator"
          required
          value={formData.calc_operator}
          onChange={handleChange}
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
          name="value"
          step="0.01"
          required
          value={formData.value}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
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
  );
};

export { TaxList };
export default TaxList;