// src/pages/Customer/hooks/useCustomerList.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import { CustomerService } from '@/services/api';
import type { Customer } from '../types';

const useCustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CustomerService.list();
      setCustomers(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar clientes'
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await CustomerService.delete(id);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Cliente excluído com sucesso'
      });
      await loadCustomers();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao excluir cliente'
      });
    }
  }, [loadCustomers, showToast]);

  const handleImport = useCallback(async (file: File) => {
    try {
      await CustomerService.import(file);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Clientes importados com sucesso'
      });
      await loadCustomers();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao importar clientes'
      });
    }
  }, [loadCustomers, showToast]);

  const handleExport = useCallback(async () => {
    try {
      await CustomerService.export();
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Clientes exportados com sucesso'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao exportar clientes'
      });
    }
  }, [showToast]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    customers,
    loading,
    handleDelete,
    handleImport,
    handleExport,
    reloadCustomers: loadCustomers
  };
};

export {
    useCustomerList
};