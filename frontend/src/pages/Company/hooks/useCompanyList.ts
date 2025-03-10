import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/useToast';
import { companyService } from '@/pages/Company/services/CompanyService';
import type { Company, CompanyListParams } from '@/pages/Company/types/CompanyTypes';

interface UseCompanyListReturn {
  companies: Company[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  handleSearch: (term: string) => void;
  handlePageChange: (page: number) => void;
  handleDelete: (id: number) => Promise<void>;
  reloadCompanies: () => Promise<void>;
  handleExport: () => Promise<void>;
  handleImport: (file: File) => Promise<void>;
}

/**
 * Hook para gerenciar a listagem de empresas
 */
export function useCompanyList(): UseCompanyListReturn {
  const [companies, setCompanies] = useState<Company[]>([]); // Inicializa como array vazio
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<CompanyListParams>({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const { showToast } = useToast();

  // Refs para controle de estado e rastreamento
  const initialLoadDone = useRef(false);
  const loadingRef = useRef(false);
  const lastSearchTerm = useRef('');
  const lastPage = useRef(1);

  // Função para carregar empresas
  const loadCompanies = async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      console.log('Carregando empresas com parâmetros:', params);

      const response = await companyService.list(params);
      console.log('Resposta da API (bruta):', response);

      // Valida e extrai os dados do nível aninhado
      if (response && response.results && typeof response.results === 'object' && Array.isArray(response.results.results)) {
        setCompanies(response.results.results); // Extrai o array aninhado
        setPagination({
          currentPage: params.page || 1,
          totalPages: Math.ceil((response.results.total_count || response.count || response.results.results.length) / (params.limit || 10)),
          totalItems: response.results.total_count || response.count || response.results.results.length,
        });
        console.log('Empresas carregadas com sucesso:', response.results.results.length, 'itens');
      } else {
        console.warn('Resposta da API não contém um array válido em "results.results":', response);
        setCompanies([]); // Define como array vazio se a validação falhar
        setPagination({
          currentPage: params.page || 1,
          totalPages: 1,
          totalItems: 0,
        });
      }

      lastPage.current = params.page || 1;
      lastSearchTerm.current = params.search || '';

    } catch (error: any) {
      console.error('Erro ao carregar empresas:', error);
      setError(error.message || 'Não foi possível carregar a lista de empresas');
      setCompanies([]); // Garante que companies seja um array vazio em caso de erro
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar empresas',
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadCompanies();
    }
    return () => {
      initialLoadDone.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      initialLoadDone.current &&
      (lastPage.current !== params.page || lastSearchTerm.current !== params.search)
    ) {
      loadCompanies();
    }
  }, [params.page, params.search]);

  const handleSearch = (term: string) => {
    if (term === lastSearchTerm.current) return;
    setParams({
      ...params,
      search: term,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    if (page === lastPage.current) return;
    setParams({
      ...params,
      page,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await companyService.delete(id);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Empresa excluída com sucesso',
      });
      await loadCompanies();
    } catch (error: any) {
      console.error('Erro ao excluir empresa:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao excluir empresa',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const blob = await companyService.export();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'empresas.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Arquivo exportado com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao exportar empresas:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao exportar empresas',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      setLoading(true);
      await companyService.import(file);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Empresas importadas com sucesso',
      });
      setParams({
        ...params,
        page: 1,
      });
    } catch (error: any) {
      console.error('Erro ao importar empresas:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao importar empresas',
      });
    } finally {
      setLoading(false);
    }
  };

  const reloadCompanies = async () => {
    await loadCompanies();
  };

  return {
    companies,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleDelete,
    reloadCompanies,
    handleExport,
    handleImport,
  };
}

export default useCompanyList;