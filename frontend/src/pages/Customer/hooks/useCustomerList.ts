// src/pages/Customer/hooks/useCustomerList.ts
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/useToast';
import { customerService } from '@/services/api/modules/customer';
import type { Customer } from '@/types/api';
import type { CustomerListParams, CustomerExportOptions } from '@/services/api/modules/customer';

export const useCustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<CustomerListParams>({
    page: 1,
    limit: 10,
    sort_by: 'name',
    sort_order: 'asc'
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1
  });

  const { currentCompany } = useCompany();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Carrega a lista de clientes
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Iniciando carregamento...', { params, companyId: currentCompany?.id });

      if (!currentCompany?.id) {
        console.log('Sem company ID');
        return;
      }

      const response = await customerService.list({
        ...params,
        company_id: currentCompany.id
      });
      
      console.log('Resposta recebida:', response);

      setCustomers(response.results || []);
      setPagination({
        total: response.total || 0,
        totalPages: response.total_pages || 1,
        currentPage: response.current_page || 1
      });
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar lista de clientes'
      });
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [currentCompany?.id, params, showToast]);

  // Atualiza parâmetros de busca
  const handleSearch = useCallback((term: string) => {
    setParams(prev => ({
      ...prev,
      search: term,
      page: 1
    }));
  }, []);

  // Mudança de página
  const handlePageChange = useCallback((page: number) => {
    setParams(prev => ({
      ...prev,
      page
    }));
  }, []);

  // Ordenação
  const handleSort = useCallback((field: string, order: 'asc' | 'desc') => {
    setParams(prev => ({
      ...prev,
      sort_by: field,
      sort_order: order,
      page: 1
    }));
  }, []);

  // Exportação
  const handleExport = useCallback(async () => {
    if (!currentCompany?.id) return;

    const options: CustomerExportOptions = {
      format: 'xlsx',
      include_disabled: false
    };

    return customerService.export(options);
  }, [currentCompany?.id]);

  // Importação
  const handleImport = useCallback(async (file: File) => {
    if (!currentCompany?.id) return;

    return customerService.import(file, {
      update_existing: true,
      skip_errors: false
    });
  }, [currentCompany?.id]);

  // Exclusão
  const handleDelete = useCallback(async (id: number) => {
    if (!currentCompany?.id) return;

    await customerService.delete(id);
    await loadCustomers(); // Recarrega a lista após excluir
  }, [currentCompany?.id, loadCustomers]);

  // Carrega a lista inicial e quando mudam os parâmetros
  useEffect(() => {
    console.log('Effect triggered', { currentCompany, params });
    loadCustomers();
  }, [currentCompany?.id, params, loadCustomers]);

  // Debug log para monitorar estados
  useEffect(() => {
    console.log('Estado atual:', {
      loading,
      customersCount: customers.length,
      pagination,
      params,
      companyId: currentCompany?.id
    });
  }, [loading, customers, pagination, params, currentCompany?.id]);

  return {
    customers,
    loading,
    pagination,
    params,
    handleSearch,
    handlePageChange,
    handleSort,
    handleExport,
    handleImport,
    handleDelete,
    reloadCustomers: loadCustomers
  };
};

export default useCustomerList;