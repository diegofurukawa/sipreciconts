// src/pages/Company/hooks/useCompanyList.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '../types';
import { api } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/routes/config/route-paths';

interface UseCompanyListProps {
  initialData?: Company[];
}

export const useCompanyList = ({ initialData = [] }: UseCompanyListProps = {}) => {
  const [companies, setCompanies] = useState<Company[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<{ data: Company[] }>('/companies/');
      setCompanies(data.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Não foi possível carregar as empresas.';
      setError(errorMessage);
      showToast({
        type: 'error',
        title: 'Erro ao carregar empresas',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      setDeleteLoading(id);
      await api.delete(`/companies/${id}`);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Empresa excluída com sucesso.'
      });
      
      await loadCompanies();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao excluir empresa.';
      showToast({
        type: 'error',
        title: 'Erro ao excluir',
        message: errorMessage
      });
    } finally {
      setDeleteLoading(null);
    }
  }, [loadCompanies, showToast]);

  const handleEdit = useCallback((id: number) => {
    navigate(ROUTES.PRIVATE.CADASTROS.EMPRESA.EDITAR(id));
  }, [navigate]);

  const handleNew = useCallback(() => {
    navigate(ROUTES.PRIVATE.CADASTROS.EMPRESA.NOVO);
  }, [navigate]);

  const handleView = useCallback((id: number) => {
    navigate(ROUTES.PRIVATE.CADASTROS.EMPRESA.DETALHES(id));
  }, [navigate]);

  const refresh = useCallback(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  return {
    // Estado
    companies,
    loading,
    error,
    deleteLoading,
    
    // Ações
    handleDelete,
    handleEdit,
    handleNew,
    handleView,
    refresh,
    
    // Utils
    isDeleting: (id: number) => deleteLoading === id,
    isEmpty: companies.length === 0,
    hasError: !!error
  };
};

// Tipo de retorno do hook para type safety
export type UseCompanyListReturn = ReturnType<typeof useCompanyList>;