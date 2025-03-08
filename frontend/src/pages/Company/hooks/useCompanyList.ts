// src/pages/Company/hooks/useCompanyList.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';
import { logger } from '@/utils/logger';
import axios from 'axios';
import { DEFAULT_API_CONFIG } from '@/services/apiMainService/config';
import { headerManager } from '@/services/apiMainService/headers/headerManager';
import type { Company } from '@/pages/Company/types/company_types';

interface UseCompanyListProps {
  initialData?: Company[];
}

interface CompanyApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Company[];
}



/**
 * Hook para gerenciar listagem de empresas
 * Integrado com o sistema de logging e estados de página
 */
export const useCompanyList = ({ initialData = [] }: UseCompanyListProps = {}) => {
  // ID da página para logging consistente
  const pageId = 'company_list';
  
  // Estado
  const [companies, setCompanies] = useState<Company[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    nextPage: null as string | null,
    previousPage: null as string | null
  });

  // setCompanies([
  //   { company_id: "COMP001", name: "Test Company", document: "12.345.678/0001-99", email: "test@test.com", phone: "5511987654321", enabled: true }
  // ]);

  // Hooks
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Refs para controle de estado
  const isMounted = useRef(true);
  const isLoadingRef = useRef(false);
  const hasLoadedInitially = useRef(false);
  
  // Log de inicialização
  useEffect(() => {
    logger.debug('HookInitialization', 'useCompanyList initialized', { 
      pageId,
      initialDataCount: initialData.length
    });
    
    return () => {
      isMounted.current = false;
      logger.debug('HookCleanup', 'useCompanyList cleanup', { pageId });
    };
  }, [initialData.length]);
  
  // Configuração inicial para os headers de autenticação
  useEffect(() => {
    // Configura o token de autenticação no headerManager usando useAuth
    if (isAuthenticated && user) {
      const token = localStorage.getItem('access_token'); // Ajustado para a chave correta usada pelo TokenService
      if (token) {
        headerManager.setAuthToken(token);
      } else {
        // Se não houver token, redireciona para login
        navigate('/login');
      }
      
      // Configura o ID da empresa se disponível
      if (user.company_id) {
        headerManager.setCompanyId(user.company_id);
      }
    } else {
      // Se não estiver autenticado, redireciona para login
      navigate('/login');
    }
  }, [user, isAuthenticated, navigate]);

  /**
   * Carrega a lista de empresas
   * @param page Número da página a ser carregada
   */

const loadCompanies = useCallback(async (page = 1) => {
  if (isLoadingRef.current || !isMounted.current) return;

  if (!isAuthenticated) {
    navigate('/login');
    return;
  }

  try {
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    logger.info('DataLoading', 'Loading companies', {
      pageId,
      page,
      companyId: user?.company_id,
    });

    const companyId = user?.company_id || 'ADMIN';

    const baseUrl = DEFAULT_API_CONFIG?.baseURL || 'http://localhost:8000/api';

    const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
    const urlWithParams = `${baseUrl}/companies/?page=${page}&limit=10&sort_by=name&sort_order=asc&company_id=${companyId}${searchParam}`;

    const headers = headerManager.getHeaders();

    const response = await axios.get<CompanyApiResponse>(urlWithParams, { headers });

    const data = response.data;

    if (data && data.results && Array.isArray(data.results)) {
      // Mapeia os dados da API para o tipo Company
      const mappedCompanies: Company[] = data.results.map((item) => ({
        company_id: item.company_id,
        name: item.name,
        document: item.document,
        email: item.email,
        phone: item.phone,
        enabled: item.enabled,
        administrators_count: item.administrators_count,
        employees_count: item.employees_count,
      }));

      setCompanies(mappedCompanies);

      const totalItems = data.count || 0;
      const totalPages = Math.ceil(totalItems / 10);

      setPagination({
        currentPage: page,
        totalPages,
        totalItems,
        nextPage: data.next,
        previousPage: data.previous,
      });

      logger.info('DataLoading', 'Companies loaded successfully', {
        pageId,
        count: data.results.length,
        totalItems,
        totalPages,
        page,
      });
    } else {
      logger.warn('DataLoading', 'Unexpected response format', {
        pageId,
        responseType: typeof data,
        hasResults: !!data?.results,
      });
      setCompanies([]);
    }
  } catch (error: any) {
    logger.error('DataLoading', 'Error loading companies', {
      pageId,
      statusCode: error.response?.status,
      errorMessage: error.message,
    }, error);

    let errorMessage = 'Erro ao carregar empresas';
    if (error.response) {
      errorMessage = `Erro ${error.response.status}: ${error.response.statusText}`;
      if (error.response.data && error.response.data.detail) {
        errorMessage += ` - ${error.response.data.detail}`;
      }

      if (error.response.status === 401) {
        errorMessage = 'Você precisa fazer login para acessar esta página.';
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        headerManager.clearAuthHeaders();
        setTimeout(() => {
          navigate('/login?expired=true');
        }, 1500);
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    setError(errorMessage);

    showToast({
      type: 'error',
      title: 'Erro',
      message: errorMessage,
    });

    setCompanies([]);
  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
    isLoadingRef.current = false;
  }
}, [showToast, user?.company_id, searchTerm, isAuthenticated, navigate]);

// ... (código restante)

  /**
   * Muda a página na paginação
   */
  const handlePageChange = useCallback((page: number) => {
    if (page === pagination.currentPage) return;
    
    logger.userAction('pagination_change', { 
      pageId, 
      fromPage: pagination.currentPage,
      toPage: page
    });
    
    loadCompanies(page);
  }, [pagination.currentPage, loadCompanies, pageId]);

  /**
   * Exclui uma empresa
   */
  const handleDelete = useCallback(async (id: number) => {
    if (!isMounted.current) return;
    
    try {
      logger.userAction('delete_company', { pageId, companyId: id });
      setDeleteLoading(id);
      
      const baseUrl = DEFAULT_API_CONFIG?.baseURL || 'http://localhost:8000/api';
      const headers = headerManager.getHeaders();
      
      await axios.delete(`${baseUrl}/companies/${id}/`, { headers });
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Empresa excluída com sucesso'
      });
      
      logger.info('DataAction', 'Company deleted successfully', { 
        pageId, 
        companyId: id 
      });
      
      // Recarrega a lista após excluir
      loadCompanies(pagination.currentPage);
    } catch (error: any) {
      logger.error('DataAction', 'Error deleting company', { 
        pageId,
        companyId: id,
        statusCode: error.response?.status,
        errorMessage: error.message
      }, error);
      
      let errorMessage = 'Erro ao excluir empresa';
      if (error.response) {
        errorMessage = `Erro ${error.response.status}: ${error.response.statusText}`;
        if (error.response.data && error.response.data.detail) {
          errorMessage += ` - ${error.response.data.detail}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast({
        type: 'error',
        title: 'Erro',
        message: errorMessage
      });
    } finally {
      if (isMounted.current) {
        setDeleteLoading(null);
      }
    }
  }, [loadCompanies, pagination.currentPage, showToast, pageId]);

  /**
   * Navega para a página de edição
   */
  const handleEdit = useCallback((id: number) => {
    logger.userAction('edit_company', { pageId, companyId: id });
    navigate(CADASTROS_ROUTES.EMPRESA.EDIT(id));
  }, [navigate, pageId]);

  /**
   * Navega para a página de criação
   */
  const handleNew = useCallback(() => {
    logger.userAction('create_new_company', { pageId });
    navigate(CADASTROS_ROUTES.EMPRESA.NEW);
  }, [navigate, pageId]);

  /**
   * Navega para a página de detalhes
   */
  const handleView = useCallback((id: number) => {
    logger.userAction('view_company_details', { pageId, companyId: id });
    navigate(CADASTROS_ROUTES.EMPRESA.DETAILS(id));
  }, [navigate, pageId]);

  /**
   * Realiza busca de empresas
   */
  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);
    
    logger.userAction('search_companies', { 
      pageId, 
      searchTerm: term,
      isEmpty: !term.trim()
    });
    
    // Reset para a primeira página
    loadCompanies(1);
  }, [loadCompanies, pageId]);

  /**
   * Simula funcionalidade de importação
   */
  const handleImport = useCallback(() => {
    logger.userAction('import_companies', { pageId });
    
    showToast({
      type: 'info',
      title: 'Importação',
      message: 'Funcionalidade de importação em desenvolvimento'
    });
  }, [showToast, pageId]);

  /**
   * Simula funcionalidade de exportação
   */
  const handleExport = useCallback(() => {
    logger.userAction('export_companies', { pageId });
    
    showToast({
      type: 'info',
      title: 'Exportação',
      message: 'Funcionalidade de exportação em desenvolvimento'
    });
  }, [showToast, pageId]);

  // Carregar dados iniciais
  useEffect(() => {
    isMounted.current = true;
    
    if (!hasLoadedInitially.current) {
      hasLoadedInitially.current = true;
      
      // Carrega os dados quando o componente é montado
      loadCompanies();
    }
    
    // Cleanup na desmontagem
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
    searchTerm,
    pageId,
    
    // Ações
    handleDelete,
    handleEdit,
    handleNew,
    handleView,
    handlePageChange,
    handleSearch,
    handleImport,
    handleExport,
    refresh: () => loadCompanies(),
    retry: () => loadCompanies(pagination.currentPage),
    
    // Utilitários
    isDeleting: (id: number) => deleteLoading === id,
    isEmpty: companies.length === 0,
    hasError: !!error
  };
};

export type UseCompanyListReturn = ReturnType<typeof useCompanyList>;