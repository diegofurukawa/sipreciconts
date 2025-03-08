import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '@/auth/context/CompanyContext';
import { useToast } from '@/hooks/useToast';
import { customerService } from '@/pages/Customer/services';
import type { Customer, CustomerListParams } from '@/pages/Customer/types/index';

export const useCustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<CustomerListParams>({
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

  const { currentCompany } = useCompany();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const initialLoadDone = useRef(false);
  const loadingRef = useRef(false);
  const lastSearchTerm = useRef('');
  const lastPage = useRef(1);

  const loadCustomers = async () => {
    if (loadingRef.current || !currentCompany?.company_id) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      console.log('Carregando clientes com parâmetros:', params, 'companyId:', currentCompany?.company_id);

      const response = await customerService.list({
        ...params,
        company_id: currentCompany.company_id,
      });
      console.log('Resposta da API (bruta):', response);

      let results = response.results;
      if (response.results && typeof response.results === 'object' && Array.isArray(response.results.results)) {
        results = response.results.results;
      } else if (!Array.isArray(results)) {
        console.warn('Resposta da API não contém um array válido em "results":', response);
        results = [];
      }

      setCustomers(results);
      setPagination({
        currentPage: params.page || 1,
        totalPages: Math.ceil((response.count || response.total || results.length) / (params.limit || 10)),
        totalItems: response.count || response.total || results.length,
      });
      console.log('Clientes carregados com sucesso:', results.length, 'itens');

      lastPage.current = params.page || 1;
      lastSearchTerm.current = params.search || '';
    } catch (error: any) {
      console.error('Erro ao carregar clientes:', error);
      setError(error.message || 'Não foi possível carregar a lista de clientes');
      setCustomers([]);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar clientes',
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoadDone.current && currentCompany?.company_id) {
      initialLoadDone.current = true;
      loadCustomers();
    }
    return () => {
      initialLoadDone.current = false;
    };
  }, [currentCompany?.company_id]);

  useEffect(() => {
    if (initialLoadDone.current && (lastPage.current !== params.page || lastSearchTerm.current !== params.search)) {
      loadCustomers();
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

  const handleExport = useCallback(async () => {
    if (!currentCompany?.company_id) return;
    try {
      setLoading(true);
      const blob = await customerService.export('xlsx');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clientes.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Arquivo exportado com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao exportar clientes:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao exportar clientes',
      });
    } finally {
      setLoading(false);
    }
  }, [currentCompany?.company_id, showToast]);

  const handleImport = useCallback(async (file: File) => {
    if (!currentCompany?.company_id) return;
    try {
      setLoading(true);
      await customerService.import(file);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Clientes importados com sucesso',
      });
      setParams((prev) => ({
        ...prev,
        page: 1,
      }));
    } catch (error: any) {
      console.error('Erro ao importar clientes:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao importar clientes',
      });
    } finally {
      setLoading(false);
    }
  }, [currentCompany?.company_id, showToast]);

  const handleDelete = useCallback(async (id: number) => {
    if (!currentCompany?.company_id) return;
    try {
      setLoading(true);
      await customerService.delete(id);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Cliente excluído com sucesso',
      });
      await loadCustomers();
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao excluir cliente',
      });
    } finally {
      setLoading(false);
    }
  }, [currentCompany?.company_id, loadCustomers, showToast]);

  return {
    customers,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleSort,
    handleExport,
    handleImport,
    handleDelete,
    reloadCustomers: loadCustomers,
  };
};

export default useCustomerList;