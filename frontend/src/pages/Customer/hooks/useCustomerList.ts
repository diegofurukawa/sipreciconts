// src/hooks/useCustomerList.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/useToast';
import { useCustomerApi } from '@/hooks/api/useCustomerApi';
import type { Customer, PaginatedResponse } from '@/types/api';

interface UseCustomerListOptions {
  pageSize?: number;
  autoLoad?: boolean;
}

interface UseCustomerListReturn {
  // Data
  customers: Customer[];
  totalCount: number;
  currentPage: number;
  
  // Loading states
  loading: boolean;
  refreshing: boolean;
  processing: boolean;
  
  // Error state
  error: string | null;
  
  // Pagination
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  
  // Actions
  loadCustomers: (page?: number) => Promise<void>;
  refreshList: () => Promise<void>;
  loadNextPage: () => Promise<void>;
  loadPreviousPage: () => Promise<void>;
  
  // CRUD operations
  handleDelete: (id: number) => Promise<void>;
  handleDeleteMany: (ids: number[]) => Promise<void>;
  
  // Import/Export
  handleImport: (file: File) => Promise<void>;
  handleExport: () => Promise<void>;
  downloadTemplate: () => Promise<void>;
  
  // Selection
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  toggleSelection: (id: number) => void;
  clearSelection: () => void;
}

export const useCustomerList = (
  options: UseCustomerListOptions = {}
): UseCustomerListReturn => {
  // Defaults
  const { pageSize = 10, autoLoad = true } = options;

  // Hooks
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const { showToast } = useToast();
  const customerApi = useCustomerApi();

  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Computed values
  const hasNextPage = customers.length > 0 && customers.length < totalCount;
  const hasPreviousPage = currentPage > 1;

  // Main data loading function
  const loadCustomers = useCallback(async (page: number = currentPage) => {
    if (!currentCompany?.id) {
      setError('Nenhuma empresa selecionada');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await customerApi.list({
        page,
        limit: pageSize,
        company_id: currentCompany.id
      });

      setCustomers(response.results);
      setTotalCount(response.count);
      setCurrentPage(page);
    } catch (error: any) {
      console.error('Erro ao carregar clientes:', error);
      setError('Erro ao carregar lista de clientes');
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.response?.data?.message || 'Erro ao carregar clientes'
      });
    } finally {
      setLoading(false);
    }
  }, [currentCompany?.id, pageSize, customerApi, showToast]);

  // Refresh without changing page
  const refreshList = useCallback(async () => {
    if (refreshing) return;
    
    try {
      setRefreshing(true);
      await loadCustomers(currentPage);
    } finally {
      setRefreshing(false);
    }
  }, [currentPage, loadCustomers, refreshing]);

  // Pagination handlers
  const loadNextPage = useCallback(async () => {
    if (hasNextPage && !loading) {
      await loadCustomers(currentPage + 1);
    }
  }, [currentPage, hasNextPage, loading, loadCustomers]);

  const loadPreviousPage = useCallback(async () => {
    if (hasPreviousPage && !loading) {
      await loadCustomers(currentPage - 1);
    }
  }, [currentPage, hasPreviousPage, loading, loadCustomers]);

  // CRUD Operations
  const handleDelete = useCallback(async (id: number) => {
    try {
      setProcessing(true);
      await customerApi.delete(id);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Cliente excluído com sucesso'
      });
      await refreshList();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.response?.data?.message || 'Erro ao excluir cliente'
      });
    } finally {
      setProcessing(false);
    }
  }, [customerApi, refreshList, showToast]);

  const handleDeleteMany = useCallback(async (ids: number[]) => {
    try {
      setProcessing(true);
      await Promise.all(ids.map(id => customerApi.delete(id)));
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Clientes excluídos com sucesso'
      });
      setSelectedIds([]);
      await refreshList();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.response?.data?.message || 'Erro ao excluir clientes'
      });
    } finally {
      setProcessing(false);
    }
  }, [customerApi, refreshList, showToast]);

  // Import/Export
  const handleImport = useCallback(async (file: File) => {
    try {
      setProcessing(true);
      await customerApi.import(file);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Clientes importados com sucesso'
      });
      await refreshList();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.response?.data?.message || 'Erro ao importar clientes'
      });
    } finally {
      setProcessing(false);
    }
  }, [customerApi, refreshList, showToast]);

  const handleExport = useCallback(async () => {
    try {
      setProcessing(true);
      const blob = await customerApi.export();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clientes_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Dados exportados com sucesso'
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.response?.data?.message || 'Erro ao exportar dados'
      });
    } finally {
      setProcessing(false);
    }
  }, [customerApi, showToast]);

  const downloadTemplate = useCallback(async () => {
    try {
      setProcessing(true);
      const blob = await customerApi.exportTemplate();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'template_importacao_clientes.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao baixar template'
      });
    } finally {
      setProcessing(false);
    }
  }, [customerApi, showToast]);

  // Selection handlers
  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // Initial load
  useEffect(() => {
    if (autoLoad && currentCompany?.id) {
      loadCustomers(1);
    }
  }, [autoLoad, currentCompany?.id, loadCustomers]);

  return {
    // Data
    customers,
    totalCount,
    currentPage,
    
    // Loading states
    loading,
    refreshing,
    processing,
    
    // Error state
    error,
    
    // Pagination
    hasNextPage,
    hasPreviousPage,
    
    // Actions
    loadCustomers,
    refreshList,
    loadNextPage,
    loadPreviousPage,
    
    // CRUD operations
    handleDelete,
    handleDeleteMany,
    
    // Import/Export
    handleImport,
    handleExport,
    downloadTemplate,
    
    // Selection
    selectedIds,
    setSelectedIds,
    toggleSelection,
    clearSelection
  };
};

export default useCustomerList;