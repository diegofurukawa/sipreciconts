// src/pages/Customer/hooks/useCustomerList.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { CustomerService } from '@/services/api';
import type { Customer } from '../types';

const useCustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth(); // Pegando o user do contexto

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CustomerService.list({
        company_id: user?.company_id // Enviando company_id nas requisições
      });
      setCustomers(data);
    } catch (error: any) {
      console.error('Erro ao carregar clientes:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.response?.data?.message || 'Erro ao carregar clientes'
      });
    } finally {
      setLoading(false);
    }
  }, [showToast, user?.company_id]); // Adicionando user?.company_id como dependência

  // Só carrega os dados quando tiver um company_id
  useEffect(() => {
    if (user?.company_id) {
      loadCustomers();
    }
  }, [loadCustomers, user?.company_id]);

  const handleDelete = async (id: number) => {
    try {
      await CustomerService.delete(id);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Cliente excluído com sucesso'
      });
      await loadCustomers();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.response?.data?.message || 'Erro ao excluir cliente'
      });
    }
  };

  const handleImport = async (file: File) => {
    try {
      await CustomerService.import(file);
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Clientes importados com sucesso'
      });
      await loadCustomers();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.response?.data?.message || 'Erro ao importar clientes'
      });
    }
  };

  const handleExport = async () => {
    try {
      await CustomerService.export();
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
    }
  };

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