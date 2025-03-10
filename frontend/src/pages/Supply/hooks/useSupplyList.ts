// src/pages/Supply/hooks/useSupplyList.ts
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/useToast';
import { SupplyService } from '@/pages/Supply/services';
import type { Supply } from '@/pages/Supply/types';

interface UseSupplyListReturn {
  supplies: Supply[];
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
  reloadSupplies: () => Promise<void>;
  handleExport: () => Promise<void>;
  handleImport: (file: File) => Promise<void>;
}

export function useSupplyList(): UseSupplyListReturn {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);

  const { showToast } = useToast();
  
  // Usamos uma ref para controlar se já fizemos a requisição inicial
  const initialLoadDone = useRef(false);
  // Ref para o último termo de busca usado
  const lastSearchTerm = useRef('');
  // Ref para a última página carregada
  const lastPage = useRef(1);

  // Função para carregar insumos
  const loadSupplies = async (page = currentPage, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Carregando insumos com parâmetros:', { page, pageSize, search });
      
      const response = await SupplyService.list(page, pageSize, search);
      
      setSupplies(response.results);
      setTotalItems(response.count);
      setTotalPages(Math.ceil(response.count / pageSize));
      
      // Atualiza as refs com os valores atuais
      lastPage.current = page;
      lastSearchTerm.current = search;
      
    } catch (error: any) {
      console.error('Erro ao carregar insumos:', error);
      setError(error.message || 'Não foi possível carregar a lista de insumos');
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar insumos'
      });
    } finally {
      setLoading(false);
    }
  };

  // Este efeito é executado apenas uma vez na montagem
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadSupplies(1, '');
    }
    
    // Cleanup function
    return () => {
      initialLoadDone.current = false;
    };
  }, []); // Array vazio = executado apenas uma vez

  // Manipuladores de eventos
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    loadSupplies(1, term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadSupplies(page, searchTerm);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await SupplyService.delete(id);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Insumo excluído com sucesso'
      });
      
      // Recarrega a lista
      await loadSupplies();
    } catch (error: any) {
      console.error('Erro ao excluir insumo:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao excluir insumo'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      await SupplyService.export();
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Arquivo exportado com sucesso'
      });
    } catch (error: any) {
      console.error('Erro ao exportar insumos:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao exportar insumos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      setLoading(true);
      await SupplyService.import(file);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Insumos importados com sucesso'
      });
      
      // Recarrega a lista após importação
      setCurrentPage(1);
      await loadSupplies(1, '');
    } catch (error: any) {
      console.error('Erro ao importar insumos:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao importar insumos'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    supplies,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalItems
    },
    handleSearch,
    handlePageChange,
    handleDelete,
    reloadSupplies: () => loadSupplies(),
    handleExport,
    handleImport
  };
}

export default useSupplyList;