// src/pages/Company/hooks/useCompanyList.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';
import { useAuth } from '@/contexts/AuthContext';

// Definição da interface Company
export interface Company {
  id: number;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  enabled?: boolean;
  created?: string;
  updated?: string;
  company_id?: string;
}

// Interface para resposta da API paginada
interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Company[];
  total_count?: number;
}

interface UseCompanyListProps {
  initialData?: Company[];
}

export const useCompanyList = ({ initialData = [] }: UseCompanyListProps = {}) => {
  const [companies, setCompanies] = useState<Company[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    nextPage: null as string | null,
    previousPage: null as string | null
  });

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { signOut, isAuthenticated } = useAuth();

  // Ref para controlar se o componente está montado
  const isMounted = useRef(true);
  
  // Ref para controlar se uma requisição já está em andamento
  const isLoadingRef = useRef(false);
  
  // Ref para controlar se o primeiro load já foi feito
  const hasLoadedInitially = useRef(false);

  // Carregar empresas a partir de uma URL completa
  const loadCompaniesFromUrl = useCallback(async (url: string) => {
    if (isLoadingRef.current || !isMounted.current) return;
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      
      // Fazer requisição diretamente à URL fornecida
      const response = await apiService.get(url);
      
      if (!isMounted.current) return;
      
      // Processar a resposta
      if (response && response.results && Array.isArray(response.results)) {
        setCompanies(response.results);
        
        // Atualizar informações de paginação
        const totalItems = response.count || response.total_count || 0;
        const totalPages = Math.ceil(totalItems / 10); // Assumindo 10 itens por página
        
        // Extrair página atual da URL
        let currentPage = 1;
        const pageMatch = url.match(/page=(\d+)/);
        if (pageMatch && pageMatch[1]) {
          currentPage = parseInt(pageMatch[1], 10);
        }
        
        setPagination({
          currentPage,
          totalPages,
          totalItems,
          nextPage: response.next,
          previousPage: response.previous
        });
      } else {
        console.warn('Formato de resposta inesperado em loadCompaniesFromUrl:', response);
        setCompanies([]);
      }
    } catch (err: any) {
      console.error('Erro ao carregar empresas da URL:', err);
      
      if (!isMounted.current) return;
      
      const errorMessage = err.response?.data?.message || 'Não foi possível carregar as empresas.';
      setError(errorMessage);
      
      // Verificar se é erro de autenticação
      if (err.response?.status === 401) {
        handleAuthError();
      } else {
        showToast({
          type: 'error',
          title: 'Erro ao carregar empresas',
          message: errorMessage
        });
      }
      
      setCompanies([]);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isLoadingRef.current = false;
    }
  }, [showToast]);

  // Lidar com erros de autenticação
  const handleAuthError = useCallback(() => {
    showToast({
      type: 'warning',
      title: 'Sessão expirada',
      message: 'Sua sessão expirou. Por favor, faça login novamente.'
    });
    
    // Redirecionar para o login com retorno para a página atual
    const currentPath = window.location.pathname;
    signOut();
    navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
  }, [navigate, showToast, signOut]);

  // Carregar empresas com parâmetros de paginação
  const loadCompanies = useCallback(async (page = 1) => {
    // Evita múltiplas requisições simultâneas
    if (isLoadingRef.current || !isMounted.current) return;
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      
      // Verificar autenticação
      if (!isAuthenticated) {
        handleAuthError();
        return;
      }
      
      // Construir parâmetros da requisição
      const params = { page };
      
      // Chamada à API
      const response = await apiService.get('/companies/', { params });
      
      // Verificar se o componente ainda está montado antes de atualizar o estado
      if (!isMounted.current) return;
      
      // Verificar a estrutura da resposta e extrair os dados corretamente
      if (response && response.results && Array.isArray(response.results)) {
        // Este é o formato detectado nos logs: { count, next, previous, results, total_count }
        setCompanies(response.results);
        
        // Atualizar informações de paginação
        const totalItems = response.count || response.total_count || 0;
        const totalPages = Math.ceil(totalItems / 10); // Assumindo 10 itens por página
        
        setPagination({
          currentPage: page,
          totalPages,
          totalItems,
          nextPage: response.next,
          previousPage: response.previous
        });
      } else if (response && Array.isArray(response)) {
        // Se a resposta já for um array
        setCompanies(response);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: response.length,
          nextPage: null,
          previousPage: null
        });
      } else if (response && response.data && Array.isArray(response.data)) {
        // Se a resposta tiver uma propriedade data que é um array
        setCompanies(response.data);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: response.data.length,
          nextPage: null,
          previousPage: null
        });
      } else if (response && response.data && response.data.results && Array.isArray(response.data.results)) {
        // Se a resposta tiver data.results que é um array
        setCompanies(response.data.results);
        
        // Atualizar informações de paginação
        const totalItems = response.data.count || response.data.total_count || 0;
        const totalPages = Math.ceil(totalItems / 10); // Assumindo 10 itens por página
        
        setPagination({
          currentPage: page,
          totalPages,
          totalItems,
          nextPage: response.data.next,
          previousPage: response.data.previous
        });
      } else {
        console.warn('Formato de resposta inesperado:', response);
        setCompanies([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          nextPage: null,
          previousPage: null
        });
      }
    } catch (err: any) {
      console.error('Erro ao carregar empresas:', err);
      
      if (!isMounted.current) return;
      
      const errorMessage = err.response?.data?.message || 'Não foi possível carregar as empresas.';
      setError(errorMessage);
      
      // Verificar se é erro de autenticação
      if (err.response?.status === 401) {
        handleAuthError();
      } else {
        showToast({
          type: 'error',
          title: 'Erro ao carregar empresas',
          message: errorMessage
        });
      }
      
      setCompanies([]);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isLoadingRef.current = false;
    }
  }, [showToast, isAuthenticated, handleAuthError]);

  // Trocar de página
  const handlePageChange = useCallback((page: number) => {
    if (page === pagination.currentPage) return;
    
    // Se temos URL para próxima/página anterior, use-a diretamente
    if (page > pagination.currentPage && pagination.nextPage) {
      loadCompaniesFromUrl(pagination.nextPage);
    } else if (page < pagination.currentPage && pagination.previousPage) {
      loadCompaniesFromUrl(pagination.previousPage);
    } else {
      // Caso contrário, construa a URL com o parâmetro de página
      loadCompanies(page);
    }
  }, [pagination, loadCompanies, loadCompaniesFromUrl]);

  const handleDelete = useCallback(async (id: number) => {
    if (!isMounted.current) return;
    
    try {
      setDeleteLoading(id);
      
      // Verificar autenticação
      if (!isAuthenticated) {
        handleAuthError();
        return;
      }
      
      await apiService.delete(`/companies/${id}`);
      
      if (!isMounted.current) return;
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Empresa excluída com sucesso'
      });
      
      // Recarrega a lista após excluir para sincronizar com o servidor
      loadCompanies(pagination.currentPage);
    } catch (err: any) {
      if (!isMounted.current) return;
      
      // Verificar se é erro de autenticação
      if (err.response?.status === 401) {
        handleAuthError();
        return;
      }
      
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
  }, [loadCompanies, showToast, pagination.currentPage, isAuthenticated, handleAuthError]);

  const handleEdit = useCallback((id: number) => {
    navigate(CADASTROS_ROUTES.EMPRESA.EDIT(id));
  }, [navigate]);

  const handleNew = useCallback(() => {
    navigate(CADASTROS_ROUTES.EMPRESA.NEW);
  }, [navigate]);

  const handleView = useCallback((id: number) => {
    navigate(CADASTROS_ROUTES.EMPRESA.DETAILS(id));
  }, [navigate]);

  // Importação de empresas
  const handleImport = useCallback(async (file: File, onProgress?: (percentage: number) => void) => {
    if (!isMounted.current) return;
    
    try {
      // Verificar autenticação
      if (!isAuthenticated) {
        handleAuthError();
        return;
      }
      
      // Criar FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // Configuração para upload com progresso
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: any) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentage);
          }
        }
      };
      
      await apiService.post('/companies/import/', formData, config);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Empresas importadas com sucesso'
      });
      
      // Recarregar lista
      loadCompanies(1);
    } catch (err: any) {
      if (!isMounted.current) return;
      
      // Verificar se é erro de autenticação
      if (err.response?.status === 401) {
        handleAuthError();
        return;
      }
      
      const errorMessage = err.response?.data?.message || 'Erro ao importar empresas.';
      showToast({
        type: 'error',
        title: 'Erro ao importar',
        message: errorMessage
      });
    }
  }, [loadCompanies, showToast, isAuthenticated, handleAuthError]);

  // Exportação de empresas
  const handleExport = useCallback(async (format: 'csv' | 'xlsx' = 'xlsx') => {
    if (!isMounted.current) return;
    
    try {
      // Verificar autenticação
      if (!isAuthenticated) {
        handleAuthError();
        return;
      }
      
      // Configuração para download
      const config = {
        responseType: 'blob' as 'blob',
        headers: {
          'Accept': format === 'xlsx' 
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv'
        }
      };
      
      const response = await apiService.get('/companies/export/', config);
      
      // Criar URL para download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `empresas.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Arquivo exportado com sucesso'
      });
    } catch (err: any) {
      if (!isMounted.current) return;
      
      // Verificar se é erro de autenticação
      if (err.response?.status === 401) {
        handleAuthError();
        return;
      }
      
      const errorMessage = err.response?.data?.message || 'Erro ao exportar empresas.';
      showToast({
        type: 'error',
        title: 'Erro ao exportar',
        message: errorMessage
      });
    }
  }, [showToast, isAuthenticated, handleAuthError]);

  // Carrega os dados iniciais apenas uma vez na montagem
  useEffect(() => {
    isMounted.current = true;
    
    // Verifica se já carregou os dados para não gerar requisições duplicadas
    if (!hasLoadedInitially.current) {
      hasLoadedInitially.current = true;
      loadCompanies();
    }
    
    // Cleanup function para quando o componente desmontar
    return () => {
      isMounted.current = false;
    };
  }, [loadCompanies]);

  return {
    // Estado
    companies,
    loading,
    error,
    deleteLoading,
    pagination,
    
    // Ações
    handleDelete,
    handleEdit,
    handleNew,
    handleView,
    handlePageChange,
    handleImport,
    handleExport,
    refresh: loadCompanies,
    
    // Utilitários
    isDeleting: (id: number) => deleteLoading === id,
    isEmpty: companies.length === 0,
    hasError: !!error
  };
};

// Tipo de retorno do hook para type safety
export type UseCompanyListReturn = ReturnType<typeof useCompanyList>;