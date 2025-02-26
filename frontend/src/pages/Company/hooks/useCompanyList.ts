// src/pages/Company/hooks/useCompanyList.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';

// Definição da interface Company
export interface Company {
  id: number;
  name: string;
  document?: string;
  email?: string;
  enabled?: boolean;
  created?: string;
  updated?: string;
}

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
  
  // Ref para controlar se o componente está montado
  const isMounted = useRef(true);
  // Ref para controlar se uma requisição já está em andamento
  const isLoadingRef = useRef(false);

  const loadCompanies = useCallback(async () => {
    // Evita múltiplas requisições simultâneas
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      
      // Chamada à API
      const response = await apiService.get('/companies/');
      
      // Verificar se o componente ainda está montado antes de atualizar o estado
      if (!isMounted.current) return;
      
      // Verificar a estrutura da resposta e extrair os dados corretamente
      let companiesData: Company[] = [];
      
      if (response && Array.isArray(response)) {
        // Se a resposta já for um array
        companiesData = response;
      } else if (response && response.results && Array.isArray(response.results)) {
        // Se a resposta tiver uma propriedade results que é um array
        companiesData = response.results;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Se a resposta tiver uma propriedade data que é um array
        companiesData = response.data;
      } else if (response && response.data && response.data.results && Array.isArray(response.data.results)) {
        // Se a resposta tiver data.results que é um array
        companiesData = response.data.results;
      } else {
        console.warn('Formato de resposta inesperado, usando dados mockados', response);
        // Mock de dados caso a API retorne um formato inesperado
        companiesData = [
          { id: 1, name: 'Empresa ABC', document: '12.345.678/0001-90', email: 'contato@empresaabc.com.br' },
          { id: 2, name: 'Empresa XYZ', document: '98.765.432/0001-10', email: 'contato@empresaxyz.com.br' },
          { id: 3, name: 'Empresa 123', document: '45.678.901/0001-23', email: 'contato@empresa123.com.br' },
        ];
      }
      
      if (isMounted.current) {
        setCompanies(companiesData);
      }
    } catch (err: any) {
      console.error('Erro ao carregar empresas:', err);
      
      if (!isMounted.current) return;
      
      const errorMessage = err.response?.data?.message || 'Não foi possível carregar as empresas.';
      setError(errorMessage);
      
      showToast({
        type: 'error',
        title: 'Erro ao carregar empresas',
        message: errorMessage
      });
      
      // Fallback para dados mockados em caso de erro
      setCompanies([
        { id: 1, name: 'Empresa ABC', document: '12.345.678/0001-90', email: 'contato@empresaabc.com.br' },
        { id: 2, name: 'Empresa XYZ', document: '98.765.432/0001-10', email: 'contato@empresaxyz.com.br' },
        { id: 3, name: 'Empresa 123', document: '45.678.901/0001-23', email: 'contato@empresa123.com.br' },
      ]);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isLoadingRef.current = false;
    }
  }, [showToast]); // Removido 'companies' das dependências para evitar loop

  const handleDelete = useCallback(async (id: number) => {
    if (!isMounted.current) return;
    
    try {
      setDeleteLoading(id);
      await apiService.delete(`/companies/${id}`);
      
      if (!isMounted.current) return;
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Empresa excluída com sucesso'
      });
      
      // Filtra localmente para uma atualização rápida da UI
      setCompanies(prev => prev.filter(company => company.id !== id));
      
      // Recarrega a lista após excluir para sincronizar com o servidor
      loadCompanies();
    } catch (err: any) {
      if (!isMounted.current) return;
      
      const errorMessage = err.response?.data?.message || 'Erro ao excluir empresa.';
      showToast({
        type: 'error',
        title: 'Erro ao excluir',
        message: errorMessage
      });
    } finally {
      if (isMounted.current) {
        setDeleteLoading(null);
      }
    }
  }, [loadCompanies, showToast]);

  const handleEdit = useCallback((id: number) => {
    navigate(CADASTROS_ROUTES.EMPRESA.EDIT(id));
  }, [navigate]);

  const handleNew = useCallback(() => {
    navigate(CADASTROS_ROUTES.EMPRESA.NEW);
  }, [navigate]);

  const handleView = useCallback((id: number) => {
    navigate(CADASTROS_ROUTES.EMPRESA.DETAILS(id));
  }, [navigate]);

  // Carrega os dados iniciais apenas uma vez na montagem
  useEffect(() => {
    isMounted.current = true;
    loadCompanies();
    
    // Cleanup function para quando o componente desmontar
    return () => {
      isMounted.current = false;
    };
  }, []); // Dependência vazia para rodar apenas na montagem

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
    refresh: loadCompanies,
    
    // Utilitários
    isDeleting: (id: number) => deleteLoading === id,
    isEmpty: companies.length === 0,
    hasError: !!error
  };
};

// Tipo de retorno do hook para type safety
export type UseCompanyListReturn = ReturnType<typeof useCompanyList>;