// src/hooks/api/useCustomerApi.ts
import { useCallback, useEffect, useState } from 'react';
import { useCompany } from '@/auth/context/CompanyContext';
import { useToast } from '@/hooks/useToast';
import { customerService } from '@/services/api/modules/customer';
import type { 
  Customer, 
  CustomerCreateData, 
  CustomerUpdateData,
  PaginatedResponse
} from '@/types/api';
import type {
  CustomerListParams,
  CustomerImportResponse,
  CustomerExportOptions
} from '@/services/api/modules/customer';

export interface UseCustomerApiReturn {
  // Data operations
  list: (params?: CustomerListParams) => Promise<PaginatedResponse<Customer>>;
  getById: (id: number) => Promise<Customer>;
  create: (data: CustomerCreateData) => Promise<Customer>;
  update: (id: number, data: CustomerUpdateData) => Promise<Customer>;
  patch: (id: number, data: Partial<CustomerUpdateData>) => Promise<Customer>;
  delete: (id: number) => Promise<void>;
  hardDelete: (id: number) => Promise<void>;
  restore: (id: number) => Promise<Customer>;
  
  // Bulk operations
  bulkDelete: (ids: number[]) => Promise<void>;
  import: (
    file: File, 
    options?: { 
      update_existing?: boolean;
      skip_errors?: boolean;
    },
    onProgress?: (percentage: number) => void
  ) => Promise<CustomerImportResponse>;
  export: (options?: CustomerExportOptions) => Promise<Blob>;
  downloadTemplate: (format?: 'csv' | 'xlsx') => Promise<Blob>;
  
  // Search and validation
  search: (term: string) => Promise<Customer[]>;
  recent: (limit?: number) => Promise<Customer[]>;
  validate: (data: Partial<CustomerCreateData>) => Promise<{
    valid: boolean;
    errors?: Record<string, string[]>;
  }>;
  checkDocumentExists: (document: string) => Promise<{
    exists: boolean;
    customer_id?: number;
  }>;
  
  // Statistics
  getStats: () => Promise<{
    total: number;
    active: number;
    inactive: number;
    created_today: number;
    created_this_month: number;
  }>;
  
  // State
  loading: boolean;
  error: string | null;
  
  // Utilities
  clearError: () => void;
  setLoading: (state: boolean) => void;
}

export const useCustomerApi = (): UseCustomerApiReturn => {
  const { currentCompany } = useCompany();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize service with company context
  useEffect(() => {
    if (currentCompany?.id) {
      customerService.setCompanyId(currentCompany.id);
    }
  }, [currentCompany?.id]);

  // Error handling wrapper
  const handleError = useCallback((error: any, customMessage?: string) => {
    const errorMessage = customMessage || 'Ocorreu um erro na operação';
    console.error('Customer API Error:', error);
    setError(errorMessage);
    showToast({
      type: 'error',
      title: 'Erro',
      message: errorMessage
    });
    throw error;
  }, [showToast]);

  // API Operations with error handling and loading state
  const wrappedOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    customErrorMessage?: string,
    showSuccessToast?: boolean,
    successMessage?: string
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      if (showSuccessToast) {
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: successMessage || 'Operação realizada com sucesso'
        });
      }
      return result;
    } catch (error) {
      handleError(error, customErrorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError, showToast]);

  // Data operations
  const list = useCallback((params?: CustomerListParams) => {
    return wrappedOperation(
      () => customerService.list(params),
      'Erro ao carregar lista de clientes'
    );
  }, [wrappedOperation]);

  const getById = useCallback((id: number) => {
    return wrappedOperation(
      () => customerService.getById(id),
      'Erro ao carregar dados do cliente'
    );
  }, [wrappedOperation]);

  const create = useCallback((data: CustomerCreateData) => {
    return wrappedOperation(
      () => customerService.create(data),
      'Erro ao criar cliente',
      true,
      'Cliente criado com sucesso'
    );
  }, [wrappedOperation]);

  const update = useCallback((id: number, data: CustomerUpdateData) => {
    return wrappedOperation(
      () => customerService.update(id, data),
      'Erro ao atualizar cliente',
      true,
      'Cliente atualizado com sucesso'
    );
  }, [wrappedOperation]);

  const patch = useCallback((id: number, data: Partial<CustomerUpdateData>) => {
    return wrappedOperation(
      () => customerService.patch(id, data),
      'Erro ao atualizar cliente',
      true,
      'Cliente atualizado com sucesso'
    );
  }, [wrappedOperation]);

  const deleteCustomer = useCallback((id: number) => {
    return wrappedOperation(
      () => customerService.delete(id),
      'Erro ao excluir cliente',
      true,
      'Cliente excluído com sucesso'
    );
  }, [wrappedOperation]);

  const hardDelete = useCallback((id: number) => {
    return wrappedOperation(
      () => customerService.hardDelete(id),
      'Erro ao excluir permanentemente o cliente',
      true,
      'Cliente excluído permanentemente'
    );
  }, [wrappedOperation]);

  const restore = useCallback((id: number) => {
    return wrappedOperation(
      () => customerService.restore(id),
      'Erro ao restaurar cliente',
      true,
      'Cliente restaurado com sucesso'
    );
  }, [wrappedOperation]);

  // Bulk operations
  const bulkDelete = useCallback((ids: number[]) => {
    return wrappedOperation(
      () => customerService.bulkDelete(ids),
      'Erro ao excluir clientes',
      true,
      'Clientes excluídos com sucesso'
    );
  }, [wrappedOperation]);

  const importCustomers = useCallback((
    file: File,
    options?: { update_existing?: boolean; skip_errors?: boolean },
    onProgress?: (percentage: number) => void
  ) => {
    return wrappedOperation(
      () => customerService.import(file, options, onProgress),
      'Erro ao importar clientes',
      true,
      'Clientes importados com sucesso'
    );
  }, [wrappedOperation]);

  const exportCustomers = useCallback((options?: CustomerExportOptions) => {
    return wrappedOperation(
      () => customerService.export(options),
      'Erro ao exportar clientes'
    );
  }, [wrappedOperation]);

  const downloadTemplate = useCallback((format: 'csv' | 'xlsx' = 'csv') => {
    return wrappedOperation(
      () => customerService.downloadTemplate(format),
      'Erro ao baixar template de importação'
    );
  }, [wrappedOperation]);

  // Search and validation
  const search = useCallback((term: string) => {
    return wrappedOperation(
      () => customerService.search(term),
      'Erro ao buscar clientes'
    );
  }, [wrappedOperation]);

  const recent = useCallback((limit: number = 5) => {
    return wrappedOperation(
      () => customerService.recent(limit),
      'Erro ao carregar clientes recentes'
    );
  }, [wrappedOperation]);

  const validate = useCallback((data: Partial<CustomerCreateData>) => {
    return wrappedOperation(
      () => customerService.validate(data),
      'Erro ao validar dados do cliente'
    );
  }, [wrappedOperation]);

  const checkDocumentExists = useCallback((document: string) => {
    return wrappedOperation(
      () => customerService.checkDocumentExists(document),
      'Erro ao verificar documento'
    );
  }, [wrappedOperation]);

  // Statistics
  const getStats = useCallback(() => {
    return wrappedOperation(
      () => customerService.getStats(),
      'Erro ao carregar estatísticas'
    );
  }, [wrappedOperation]);

  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data operations
    list,
    getById,
    create,
    update,
    patch,
    delete: deleteCustomer,
    hardDelete,
    restore,
    
    // Bulk operations
    bulkDelete,
    import: importCustomers,
    export: exportCustomers,
    downloadTemplate,
    
    // Search and validation
    search,
    recent,
    validate,
    checkDocumentExists,
    
    // Statistics
    getStats,
    
    // State
    loading,
    error,
    
    // Utilities
    clearError,
    setLoading
  };
};

export default useCustomerApi;