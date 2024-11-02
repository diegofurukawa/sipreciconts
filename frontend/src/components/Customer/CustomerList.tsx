// src/components/Customer/CustomerList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { CustomerService } from '../../services/api';
import { Customer, CustomerResponse } from '../../types/customer';
import { ApiError } from '../../services/api/types';
import { useToast } from '../../hooks/useToast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog/alert-dialog';
import { Loader2, Plus, FileUp, FileDown, Pencil, Trash2 } from 'lucide-react';
//import { ApiError } from '@/services/xxx...api';

interface CustomerListProps {
  onEdit?: (customer: Customer) => void;
  onNew?: () => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onEdit, onNew }) => {
  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; customer?: Customer }>({
    show: false
  });
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const { showToast } = useToast();

  // Handlers
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CustomerService.list(page);
      setCustomers(response.results);
      setTotalItems(response.count);
    } catch (error) {
      if (error instanceof ApiError) {
        showToast({
          type: 'error',
          title: 'Erro ao carregar clientes',
          message: error.message
        });
      } else {
        showToast({
          type: 'error',
          title: 'Erro inesperado',
          message: 'Não foi possível carregar a lista de clientes'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleDelete = async (customer: Customer) => {
    if (!customer.id) return;

    try {
      await CustomerService.delete(customer.id);
      showToast({
        type: 'success',
        title: 'Cliente excluído',
        message: 'Cliente excluído com sucesso!'
      });
      await loadCustomers();
    } catch (error) {
      if (error instanceof ApiError) {
        showToast({
          type: 'error',
          title: 'Erro ao excluir',
          message: error.message
        });
      }
    } finally {
      setDeleteDialog({ show: false });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImportLoading(true);
      await CustomerService.import(file);
      showToast({
        type: 'success',
        title: 'Importação concluída',
        message: 'Clientes importados com sucesso!'
      });
      await loadCustomers();
    } catch (error) {
      if (error instanceof ApiError) {
        showToast({
          type: 'error',
          title: 'Erro na importação',
          message: error.message
        });
      }
    } finally {
      setImportLoading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      await CustomerService.export();
      showToast({
        type: 'success',
        title: 'Exportação concluída',
        message: 'Arquivo gerado com sucesso!'
      });
    } catch (error) {
      if (error instanceof ApiError) {
        showToast({
          type: 'error',
          title: 'Erro na exportação',
          message: error.message
        });
      }
    } finally {
      setExportLoading(false);
    }
  };

  const confirmDelete = (customer: Customer) => {
    setDeleteDialog({ show: true, customer });
  };

  // Render helpers
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
        <p className="mt-1 text-sm text-gray-500">
          {totalItems} cliente{totalItems !== 1 ? 's' : ''} cadastrado{totalItems !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={() => onNew?.()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </button>
        <button
          onClick={() => document.getElementById('importInput')?.click()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={importLoading}
        >
          {importLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileUp className="h-4 w-4 mr-2" />
          )}
          Importar
        </button>
        <input
          id="importInput"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleImport}
          className="hidden"
        />
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={exportLoading}
        >
          {exportLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4 mr-2" />
          )}
          Exportar
        </button>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="mt-4 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Nome
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Documento
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Celular
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {customer.document || '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {customer.celphone}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {customer.email || '-'}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => onEdit?.(customer)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </button>
                      <button
                        onClick={() => confirmDelete(customer)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  // Main render
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {renderHeader()}
      
      {loading ? renderLoading() : renderTable()}

      <AlertDialog open={deleteDialog.show}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente "{deleteDialog.customer?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialog({ show: false })}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.customer && handleDelete(deleteDialog.customer)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export {
  CustomerList
}