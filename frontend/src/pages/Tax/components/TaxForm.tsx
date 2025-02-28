// src/pages/Tax/components/TaxForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Removendo a importação do MainLayout
// import { MainLayout } from '../../../layouts/MainLayout';
import { ArrowLeft } from 'lucide-react';
import { taxService } from '../services/TaxService';
import { Tax, TAX_TYPE_LABELS, TAX_GROUP_LABELS, CALC_OPERATOR_LABELS } from '../types';
import { TAX_ROUTES } from '../routes';

const TaxForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<Tax>({
    acronym: '',
    description: '',
    type: 'tax',
    group: 'federal',
    calc_operator: '%',
    value: 0
  });

  // Carregar dados do imposto se estiver no modo de edição
  useEffect(() => {
    const loadTax = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const tax = await taxService.getById(parseInt(id));
          setFormData(tax);
        } catch (error) {
          console.error('Erro ao carregar imposto:', error);
          showFeedback('error', 'Erro ao carregar dados do imposto');
        } finally {
          setLoading(false);
        }
      }
    };

    loadTax();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) : value
    }));
    
    // Limpar erro do campo quando alterado
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.acronym) newErrors.acronym = 'Sigla é obrigatória';
    if (!formData.type) newErrors.type = 'Tipo é obrigatório';
    if (!formData.group) newErrors.group = 'Grupo é obrigatório';
    if (!formData.calc_operator) newErrors.calc_operator = 'Operador é obrigatório';
    if (isNaN(formData.value)) newErrors.value = 'Valor inválido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setSaving(true);
    
    try {
      if (isEditMode && id) {
        await taxService.update(parseInt(id), formData);
        showFeedback('success', 'Imposto atualizado com sucesso');
      } else {
        await taxService.create(formData);
        showFeedback('success', 'Imposto criado com sucesso');
      }
      
      // Redirecionar após um breve delay para permitir que o usuário veja a mensagem
      setTimeout(() => {
        navigate(TAX_ROUTES.ROOT);
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar imposto:', error);
      showFeedback('error', 'Erro ao salvar imposto');
      setSaving(false);
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCancel = () => {
    navigate(TAX_ROUTES.ROOT);
  };

  if (loading) {
    return (
      // Remover MainLayout e usar div simples para loader
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    // Remover MainLayout e substituir por div raiz
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Editar Imposto' : 'Novo Imposto'}
        </h1>
      </div>

      {feedback && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
            feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white z-50`}
        >
          {feedback.message}
        </div>
      )}

      <div className="bg-white shadow-md rounded p-6">
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">{isEditMode ? 'Editar Imposto' : 'Novo Imposto'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="acronym" className="block text-sm font-medium text-gray-700 mb-1">
                Sigla *
              </label>
              <input
                id="acronym"
                name="acronym"
                type="text"
                required
                value={formData.acronym}
                onChange={handleChange}
                maxLength={10}
                className={`w-full p-2 border rounded-md ${errors.acronym ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.acronym && (
                <p className="mt-1 text-sm text-red-600">{errors.acronym}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecione um tipo</option>
                {Object.entries(TAX_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div>
              <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                Grupo *
              </label>
              <select
                id="group"
                name="group"
                required
                value={formData.group}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.group ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecione um grupo</option>
                {Object.entries(TAX_GROUP_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.group && (
                <p className="mt-1 text-sm text-red-600">{errors.group}</p>
              )}
            </div>

            <div>
              <label htmlFor="calc_operator" className="block text-sm font-medium text-gray-700 mb-1">
                Operador de Cálculo *
              </label>
              <select
                id="calc_operator"
                name="calc_operator"
                required
                value={formData.calc_operator}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.calc_operator ? 'border-red-500' : 'border-gray-300'}`}
              >
                {Object.entries(CALC_OPERATOR_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.calc_operator && (
                <p className="mt-1 text-sm text-red-600">{errors.calc_operator}</p>
              )}
            </div>

            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                Valor *
              </label>
              <input
                id="value"
                name="value"
                type="number"
                step="0.01"
                required
                value={formData.value}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.value ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.value && (
                <p className="mt-1 text-sm text-red-600">{errors.value}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxForm;