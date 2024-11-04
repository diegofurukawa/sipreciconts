// src/hooks/api/useCustomerApi.ts
import { useCallback, useEffect, useState } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/useToast';
import { CustomerService } from '@/services/api';
import { 
  Customer, 
  CustomerCreateData, 
  CustomerUpdateData,
  PaginatedResponse,
  ApiResponse 
} from '@/types/api';

export interface UseCustomerApiReturn {
  // Data operations
  list: (params?: Record<string, any>) => Promise<PaginatedResponse<Customer>>;
  getById: (id: number) => Promise<Customer>;
  create: (data: CustomerCreateData) => Promise<Customer>;
  update: (id: number, data: CustomerUpdateData) => Promise<Customer>;
  delete: (id: number) => Promise<void>;
  
  // Bulk operations
  import: (file: File) => Promise<ApiResponse>;
  export: () => Promise<Blob>;
  exportTemplate: () => Promise<Blob>;
  
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
      CustomerService.setCompanyId(currentCompany.id);
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
    customErrorMessage?: string
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (error) {
      handleError(error, customErrorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // List customers with pagination and filters
  const list = useCallback(async (params?: Record<string, any>) => {
    return wrappedOperation(
      () => CustomerService.list(params),
      'Erro ao carregar lista de clientes'
    );
  }, [wrappedOperation]);

  // Get customer by ID
  const getById = useCallback(async (id: number) => {
    return wrappedOperation(
      () => CustomerService.getById(id),
      'Erro ao carregar dados do cliente'
    );
  }, [wrappedOperation]);

  // Create new customer
  const create = useCallback(async (data: CustomerCreateData) => {
    const result = await wrappedOperation(
      () => CustomerService.create(data),
      'Erro ao criar cliente'
    );
    showToast({
      type: 'success',
      title: 'Sucesso',
      message: 'Cliente criado com sucesso'
    });
    return result;
  }, [wrappedOperation, showToast]);

  // Update existing customer
  const update = useCallback(async (id: number, data: CustomerUpdateData) => {
    const result = await wrappedOperation(
      () => CustomerService.update(id, data),
      'Erro ao atualizar cliente'
    );
    showToast({
      type: 'success',
      title: 'Sucesso',
      message: 'Cliente atualizado com sucesso'
    });
    return result;
  }, [wrappedOperation, showToast]);

  // Delete customer
  const deleteCustomer = useCallback(async (id: number) => {
    await wrappedOperation(
      () => CustomerService.delete(id),
      'Erro ao excluir cliente'
    );
    showToast({
      type: 'success',
      title: 'Sucesso',
      message: 'Cliente excluído com sucesso'
    });
  }, [wrappedOperation, showToast]);

  // Import customers from file
  const importCustomers = useCallback(async (file: File) => {
    const result = await wrappedOperation(
      () => CustomerService.import(file),
      'Erro ao importar clientes'
    );
    showToast({
      type: 'success',
      title: 'Sucesso',
      message: 'Clientes importados com sucesso'
    });
    return result;
  }, [wrappedOperation, showToast]);

  // Export customers to file
  const exportCustomers = useCallback(async () => {
    return wrappedOperation(
      () => CustomerService.export(),
      'Erro ao exportar clientes'
    );
  }, [wrappedOperation]);

  // Get import template
  const exportTemplate = useCallback(async () => {
    return wrappedOperation(
      () => CustomerService.exportTemplate(),
      'Erro ao baixar template de importação'
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
    delete: deleteCustomer,
    
    // Bulk operations
    import: importCustomers,
    export: exportCustomers,
    exportTemplate,
    
    // State
    loading,
    error,
    
    // Utilities
    clearError,
    setLoading
  };
};

export default useCustomerApi;

/* Usage Example:
import { useCustomerApi } from '@/hooks/api';

const MyComponent = () => {
  const { 
    list, 
    create, 
    loading, 
    error 
  } = useCustomerApi();

  const loadCustomers = async () => {
    try {
      const result = await list({ 
        page: 1, 
        limit: 10,
        search: 'term' 
      });
      // Handle result
    } catch (error) {
      // Error already handled by hook
    }
  };

  return (
    <div>
      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}
      ...
    </div>
  );
};
*/