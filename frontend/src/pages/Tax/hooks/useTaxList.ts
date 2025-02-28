// src/hooks/useTaxList.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
// O correto seria:
import { taxService } from '../services/TaxService';
import type { Tax } from '../types';
import type { TaxListParams } from '../types/tax_types';

interface UseTaxListReturn {
  taxes: Tax[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  
  // Actions
  handleSearch: (term: string) => void;
  handlePageChange: (page: number) => void;
  handleDelete: (id: number) => Promise<boolean>;
  handleExport: () => Promise<void>;
  handleImport: () => void;
  
  // Refresh data
  refresh: () => Promise<void>;
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
  
  const { showToast } = useToast();

  // Fetch taxes from API
  const fetchTaxes = useCallback(async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: TaxListParams = {
        page,
        page_size: pageSize
      };
      
      // Add additional params from initialParams
      if (initialParams) {
        Object.keys(initialParams).forEach(key => {
          if (key !== 'page' && key !== 'page_size') {
            params[key as keyof TaxListParams] = initialParams[key as keyof TaxListParams];
          }
        });
      }
      
      const response = await taxService.list(params);
      
      setTaxes(response.results || []);
      setTotalItems(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / pageSize));
      setCurrentPage(page);
      
    } catch (error: any) {
      console.error('Error fetching taxes:', error);
      setError(error.message || 'Não foi possível carregar os impostos');
      
      // Reset data
      setTaxes([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, initialParams, showToast]);

  // Load taxes on component mount and when dependencies change
  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    // Implementation would depend on the API
    console.log('Search term:', term);
    // Here you would typically update params and call fetchTaxes
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    fetchTaxes(page);
  }, [fetchTaxes]);

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
        taxes.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage
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
  }, [taxes, currentPage, fetchTaxes, showToast]);

  // Handle export
  const handleExport = useCallback(async (): Promise<void> => {
    try {
      showToast({
        type: 'info',
        title: 'Exportar',
        message: 'Funcionalidade de exportação ainda não implementada'
      });
      // In a real implementation, you would call the export API and download the file
      // const blob = await taxService.export();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'impostos.xlsx';
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
    } catch (error: any) {
      console.error('Error exporting taxes:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível exportar os impostos'
      });
    }
  }, [showToast]);

  // Handle import
  const handleImport = useCallback(() => {
    showToast({
      type: 'info',
      title: 'Importar',
      message: 'Funcionalidade de importação ainda não implementada'
    });
    // In a real implementation, you would open a file dialog and upload the file
    // const input = document.createElement('input');
    // input.type = 'file';
    // input.accept = '.xlsx,.csv';
    // input.onchange = async (e) => {
    //   const file = (e.target as HTMLInputElement).files?.[0];
    //   if (file) {
    //     try {
    //       await taxService.import(file);
    //       showToast({
    //         type: 'success',
    //         title: 'Sucesso',
    //         message: 'Impostos importados com sucesso'
    //       });
    //       await fetchTaxes(1);
    //     } catch (error: any) {
    //       showToast({
    //         type: 'error',
    //         title: 'Erro',
    //         message: 'Não foi possível importar os impostos'
    //       });
    //     }
    //   }
    // };
    // input.click();
  }, [showToast]);

  return {
    taxes,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    handleSearch,
    handlePageChange,
    handleDelete,
    handleExport,
    handleImport,
    refresh: useCallback(() => fetchTaxes(currentPage), [fetchTaxes, currentPage])
  };
}

export default useTaxList;