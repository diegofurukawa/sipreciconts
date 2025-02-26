// src/pages/Company/components/CompanyList.tsx
import React, { useCallback } from 'react';
import { Pencil, Trash2, Plus, FileText, Download, Upload } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useCompanyList } from '../hooks/useCompanyList';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';

export const CompanyList: React.FC = () => {
  const { 
    companies, 
    loading, 
    error, 
    handleDelete, 
    handleEdit, 
    handleNew, 
    handleView,
    refresh,
    isDeleting,
    isEmpty
  } = useCompanyList();
  
  const [deleteDialog, setDeleteDialog] = React.useState<{show: boolean; id?: number}>({show: false});

  const confirmDelete = useCallback(async () => {
    if (deleteDialog.id) {
      await handleDelete(deleteDialog.id);
      setDeleteDialog({show: false});
    }
  }, [deleteDialog.id, handleDelete]);

  if (loading && companies.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Empresas</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie as empresas cadastradas no sistema</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleNew()}
                className="inline-flex items-center px-4 py-2 border border-transparent 
                           text-sm font-medium rounded-md shadow-sm text-white 
                           bg-emerald-600 hover:bg-emerald-700 focus:outline-none 
                           focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Empresa
              </button>
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-300 
                          text-sm font-medium rounded-md text-gray-700 bg-white 
                          hover:bg-gray-50 focus:outline-none focus:ring-2 
                          focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </button>
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-300 
                          text-sm font-medium rounded-md text-gray-700 bg-white 
                          hover:bg-gray-50 focus:outline-none focus:ring-2 
                          focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-2">
                <button 
                  className="text-sm text-red-700 font-medium hover:text-red-600"
                  onClick={() => refresh()}
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Empresas */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {loading && companies.length > 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.length > 0 ? (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{company.document || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{company.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleView(company.id)}
                        className="text-emerald-600 hover:text-emerald-900 mr-3"
                        title="Ver detalhes"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(company.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({show: true, id: company.id})}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                        disabled={isDeleting(company.id)}
                      >
                        {isDeleting(company.id) ? (
                          <div className="h-4 w-4 border-2 border-r-transparent border-red-500 rounded-full animate-spin inline-block"></div>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <div className="text-gray-500">
                      <svg 
                        className="mx-auto h-12 w-12 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                        />
                      </svg>
                      <p className="mt-2 text-sm font-medium">Nenhuma empresa encontrada</p>
                      <p className="mt-1 text-sm text-gray-500">Clique em "Nova Empresa" para cadastrar</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rodapé com paginação (pode ser implementado depois) */}
      {companies.length > 0 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Anterior
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Próximo
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">{companies.length}</span> de <span className="font-medium">{companies.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Anterior</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-emerald-600 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Próximo</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteDialog.show}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta empresa?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setDeleteDialog({show: false})}
              className="border border-gray-300"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompanyList;