// src/pages/Tax/hooks/useTaxList.ts
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/useToast';
import { taxService } from '../services/TaxService';
import type { Tax, TaxListParams } from '@/pages/Tax/types';

interface UseTaxListReturn {
  taxes: Tax[];
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
  reloadTaxes: () => Promise<void>;
  handleExport: () => Promise<void>;
  handleImport: (file: File) => Promise<void>;
}

/**
 * Hook para gerenciar a listagem de impostos
 */
export function useTaxList(): UseTaxListReturn {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<TaxListParams>({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const { showToast } = useToast();
  
  // Usamos uma ref para controlar se já fizemos a requisição inicial
  const initialLoadDone = useRef(false);
  // Usamos outra ref para controlar se temos alguma requisição em andamento
  const loadingRef = useRef(false);
  // Ref para o último termo de busca usado
  const lastSearchTerm = useRef('');
  // Ref para a última página carregada
  const lastPage = useRef(1);

  // Função para carregar impostos
  const loadTaxes = async () => {
    // Se já estiver carregando, não faz nada
    if (loadingRef.current) return;
    
    try {
      // Marca como carregando
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      console.log('Carregando impostos com parâmetros:', params);
      
      const response = await taxService.list(params);
      
      setTaxes(response.results);
      setPagination({
        currentPage: params.page || 1,
        totalPages: Math.ceil(response.count / (params.limit || 10)),
        totalItems: response.count
      });
      
      // Atualiza as refs com os valores atuais
      lastPage.current = params.page || 1;
      lastSearchTerm.current = params.search || '';
      
    } catch (error: any) {
      console.error('Erro ao carregar impostos:', error);
      setError(error.message || 'Não foi possível carregar a lista de impostos');
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar impostos'
      });
    } finally {
      // Marca como não carregando
      loadingRef.current = false;
      setLoading(false);
    }
  };

  // Este efeito é executado apenas uma vez na montagem
  useEffect(() => {
    // Se ainda não carregamos os dados iniciais
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadTaxes();
    }
    
    // Cleanup function
    return () => {
      initialLoadDone.current = false;
    };
  }, []); // Array vazio = executado apenas uma vez

  // Este efeito é disparado quando os parâmetros mudam
  useEffect(() => {
    // Só carrega se não for a primeira renderização (já tratada no efeito acima)
    // E se os parâmetros realmente mudaram
    if (initialLoadDone.current && 
        (lastPage.current !== params.page || 
         lastSearchTerm.current !== params.search)) {
      loadTaxes();
    }
  }, [params.page, params.search]); // Dependências específicas

  // Manipuladores de eventos
  const handleSearch = (term: string) => {
    // Se o termo for igual ao último, não faz nada
    if (term === lastSearchTerm.current) return;
    
    // Atualiza os parâmetros de busca
    setParams({
      ...params,
      search: term,
      page: 1 // Volta para a primeira página
    });
  };

  const handlePageChange = (page: number) => {
    // Se a página for igual à atual, não faz nada
    if (page === lastPage.current) return;
    
    // Atualiza a página
    setParams({
      ...params,
      page
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await taxService.delete(id);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Imposto excluído com sucesso'
      });
      
      // Recarrega a lista
      await loadTaxes();
    } catch (error: any) {
      console.error('Erro ao excluir imposto:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao excluir imposto'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const blob = await taxService.export();
      
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'impostos.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Arquivo exportado com sucesso'
      });
    } catch (error: any) {
      console.error('Erro ao exportar impostos:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao exportar impostos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      setLoading(true);
      await taxService.import(file);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Impostos importados com sucesso'
      });
      
      // Atualiza os parâmetros para voltar à primeira página
      setParams({
        ...params,
        page: 1
      });
    } catch (error: any) {
      console.error('Erro ao importar impostos:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao importar impostos'
      });
    } finally {
      setLoading(false);
    }
  };

  const reloadTaxes = async () => {
    await loadTaxes();
  };

  return {
    taxes,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleDelete,
    reloadTaxes,
    handleExport,
    handleImport
  };
}

export default useTaxList;