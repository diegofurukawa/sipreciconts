// src/hooks/useTaxList.ts
import { useState, useEffect, useCallback } from 'react';
import { taxService, type Tax, type TaxListParams, type PaginatedResponse } from '@/services/api/modules/Tax';
import { useToast } from '@/hooks/useToast';

interface UseTaxListReturn {
  taxes: Tax[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  
  // Actions
  handleSearch: (term: string) => void;
  handlePageChange: (page: number) => void;
  handleDelete: (id: number) => Promise<boolean>;
  handleExport: (format?: 'csv' | 'xlsx') => Promise<Blob | null>;
  handleImport: (file: File, options?: {
    updateExisting?: boolean;
    skipErrors?: boolean;
  }) => Promise<boolean>;
  
  // Refresh data
  fetchTaxes: (page?: number, search?: string) => Promise<void>;
}

export function useTaxList(initialParams?: Partial<TaxListParams>): UseTaxListReturn {
  // State
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialParams?.page || 1);
  const [pageSize] = useState(initialParams?.page_size || 10);
  const [searchTerm, setSearchTerm] = useState(initialParams?.search || '');
  
  const { showToast } = useToast();

  // Fetch taxes from API
  const fetchTaxes = useCallback(async (page: number = currentPage, search: string = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: TaxListParams = {
        page,
        page_size: pageSize
      };
      
      if (search) {
        params.search = search;
      }
      
      // Add additional params from initialParams
      if (initialParams) {
        Object.keys(initialParams).forEach(key => {
          if (key !== 'page' && key !== 'page_size' && key !== 'search') {
            params[key as keyof TaxListParams] = initialParams[key as keyof TaxListParams];
          }
        });
      }
      
      const response = await taxService.list(params);
      
      setTaxes(response.results || []);
      setTotalItems(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / pageSize));
      setCurrentPage(page);
      setSearchTerm(search);
      
    } catch (error: any) {
      console.error('Error fetching taxes:', error);
      setError(error.message || 'Não foi possível carregar os impostos');
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar a lista de impostos'
      });
      
      // Reset data
      setTaxes([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, initialParams, showToast]);

  // Load taxes on component mount and when dependencies change
  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    fetchTaxes(1, term);
  }, [fetchTaxes]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    fetchTaxes(page, searchTerm);
  }, [fetchTaxes, searchTerm]);

  // Handle delete
  const handleDelete = useCallback(async (id: number): Promise<boolean> => {
    try {
      await taxService.delete(id);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Imposto excluído com sucesso'
      });
      
      // Refresh data after delete
      await fetchTaxes(
        // If we're on the last page and deleted the last item, go to previous page
        taxes.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage,
        searchTerm
      );
      
      return true;
    } catch (error: any) {
      console.error('Error deleting tax:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível excluir o imposto'
      });
      return false;
    }
  }, [taxes, currentPage, searchTerm, fetchTaxes, showToast]);

  // Handle export
  const handleExport = useCallback(async (format: 'csv' | 'xlsx' = 'csv'): Promise<Blob | null> => {
    try {
      const blob = await taxService.export(format);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Dados exportados com sucesso'
      });
      
      return blob;
    } catch (error: any) {
      console.error('Error exporting taxes:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível exportar os dados'
      });
      return null;
    }
  }, [showToast]);

  // Handle import
  const handleImport = useCallback(async (
    file: File, 
    options?: { updateExisting?: boolean; skipErrors?: boolean }
  ): Promise<boolean> => {
    try {
      await taxService.import(file, {
        update_existing: options?.updateExisting,
        skip_errors: options?.skipErrors
      });
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Dados importados com sucesso'
      });
      
      // Refresh data after import
      await fetchTaxes(1, '');
      
      return true;
    } catch (error: any) {
      console.error('Error importing taxes:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível importar os dados'
      });
      return false;
    }
  }, [fetchTaxes, showToast]);

  return {
    taxes,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    searchTerm,
    handleSearch,
    handlePageChange,
    handleDelete,
    handleExport,
    handleImport,
    fetchTaxes
  };
}

export default useTaxList;