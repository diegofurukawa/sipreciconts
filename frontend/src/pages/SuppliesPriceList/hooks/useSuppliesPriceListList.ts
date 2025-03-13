// src/pages/SuppliesPriceList/hooks/useSuppliesPriceListList.ts
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/useToast';
import { suppliesPriceListService } from '@/pages/SuppliesPriceList/services';
import type { SuppliesPriceList, SuppliesPriceListParams } from '@/pages/SuppliesPriceList/types';

interface UseSuppliesPriceListListReturn {
  items: SuppliesPriceList[];
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
  reloadItems: () => Promise<void>;
  handleFilter: (filters: Partial<SuppliesPriceListParams>) => void;
}

export function useSuppliesPriceListList(): UseSuppliesPriceListListReturn {
  const [items, setItems] = useState<SuppliesPriceList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<SuppliesPriceListParams>({
    page: 1,
    limit: 10,
    sort_by: 'supply_name',
    sort_order: 'asc',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const { showToast } = useToast();

  // Refs for tracking state and avoiding duplicate requests
  const initialLoadDone = useRef(false);
  const loadingRef = useRef(false);
  const lastSearchTerm = useRef('');
  const lastPage = useRef(1);

  // Load items from API
  const loadItems = async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      console.log('Loading supplies price list with parameters:', params);

      const response = await suppliesPriceListService.list(params);
      console.log('API response:', response);

      // Validate and process response
      setItems(response.results);
      setPagination({
        currentPage: params.page || 1,
        totalPages: Math.ceil(response.count / (params.limit || 10)),
        totalItems: response.count
      });

      // Update last values for comparison
      lastPage.current = params.page || 1;
      lastSearchTerm.current = params.search || '';
    } catch (error: any) {
      console.error('Error loading supplies price list:', error);
      setError(error.message || 'Não foi possível carregar a lista de preços');
      setItems([]);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar lista de preços'
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadItems();
    }
    
    return () => {
      initialLoadDone.current = false;
    };
  }, []); // Run once on mount

  // Handle parameter changes
  useEffect(() => {
    if (initialLoadDone.current && (lastPage.current !== params.page || lastSearchTerm.current !== params.search)) {
      loadItems();
    }
  }, [params.page, params.search]);

  // Search handler
  const handleSearch = (term: string) => {
    if (term === lastSearchTerm.current) return;
    setParams({
      ...params,
      search: term,
      page: 1 // Reset to first page when searching
    });
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    if (page === lastPage.current) return;
    setParams({
      ...params,
      page
    });
  };

  // Delete handler
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await suppliesPriceListService.delete(id);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Item excluído com sucesso'
      });
      
      // Reload list after deletion
      await loadItems();
    } catch (error: any) {
      console.error('Error deleting supplies price list item:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao excluir item'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter handler
  const handleFilter = (filters: Partial<SuppliesPriceListParams>) => {
    setParams({
      ...params,
      ...filters,
      page: 1 // Reset to first page when filters change
    });
  };

  return {
    items,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleDelete,
    reloadItems: loadItems,
    handleFilter
  };
}