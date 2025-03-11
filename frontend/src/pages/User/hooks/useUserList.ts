// src/pages/User/hooks/useUserList.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/pages/User/services';
import type { User, UserListParams } from '@/pages/User/types';

export const useUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<UserListParams>({
    page: 1,
    limit: 10,
    sort_by: 'name',
    sort_order: 'asc',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const { showToast } = useToast();
  const navigate = useNavigate();

  const initialLoadDone = useRef(false);
  const loadingRef = useRef(false);
  const lastSearchTerm = useRef('');
  const lastPage = useRef(1);

  const loadUsers = async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      console.log('Carregando usuários com parâmetros:', params);

      const response = await userService.list(params);
      console.log('Resposta da API (bruta):', response);

      // Verifica e processa os resultados
      let results = response.results;
      if (response.results && typeof response.results === 'object' && Array.isArray(response.results.results)) {
        results = response.results.results;
      } else if (!Array.isArray(results)) {
        console.warn('Resposta da API não contém um array válido em "results":', response);
        results = [];
      }

      setUsers(results);
      setPagination({
        currentPage: params.page || 1,
        totalPages: Math.ceil((response.count || response.total || results.length) / (params.limit || 10)),
        totalItems: response.count || response.total || results.length,
      });
      console.log('Usuários carregados com sucesso:', results.length, 'itens');

      lastPage.current = params.page || 1;
      lastSearchTerm.current = params.search || '';
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      setError(error.message || 'Não foi possível carregar a lista de usuários');
      setUsers([]);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar usuários',
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadUsers();
    }
    return () => {
      initialLoadDone.current = false;
    };
  }, []);

  useEffect(() => {
    if (initialLoadDone.current && (lastPage.current !== params.page || lastSearchTerm.current !== params.search)) {
      loadUsers();
    }
  }, [params.page, params.search]);

  const handleSearch = useCallback((term: string) => {
    if (term === lastSearchTerm.current) return;
    setParams((prev) => ({
      ...prev,
      search: term,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    if (page === lastPage.current) return;
    setParams((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const handleSort = useCallback((field: string, order: 'asc' | 'desc') => {
    setParams((prev) => ({
      ...prev,
      sort_by: field,
      sort_order: order,
      page: 1,
    }));
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await userService.delete(id);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Usuário excluído com sucesso',
      });
      await loadUsers();
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao excluir usuário',
      });
    } finally {
      setLoading(false);
    }
  }, [loadUsers, showToast]);

  const handleFilterChange = useCallback((filters: Partial<UserListParams>) => {
    setParams((prev) => ({
      ...prev,
      ...filters,
      page: 1,
    }));
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleSort,
    handleDelete,
    handleFilterChange,
    reloadUsers: loadUsers,
  };
};

export default useUserList;