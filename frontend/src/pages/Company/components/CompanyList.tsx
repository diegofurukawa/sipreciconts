// src/pages/Company/components/CompanyList.tsx
import React, { useState } from 'react';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  FileText, 
  Download, 
  Upload, 
  Search, 
  X,
  RefreshCw 
} from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
import { TablePagination } from '@/components/ui/table-pagination';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useCompanyList } from '../hooks/useCompanyList';
import { useToast } from '@/hooks/useToast';

export const CompanyList: React.FC = () => {
  const { 
    companies, 
    loading, 
    error, 
    deleteLoading, 
    pagination,
    handleDelete, 
    handleEdit, 
    handleNew, 
    handleView,
    handlePageChange,
    handleSearch,
    handleImport,
    handleExport,    
    retry,
    isDeleting,
    isEmpty,
    hasError,
    pageId,
    refresh
  } = useCompanyList();
  
  const { showToast } = useToast();
  const [deleteDialog, setDeleteDialog] = useState<{show: boolean; id?: number}>({show: false});
  const [searchTerm, setSearchTerm] = useState('');
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    handleSearch('');
  };

  const showDeleteConfirmation = (id: number) => {
    setDeleteDialog({show: true, id});
  };

  const confirmDelete = async () => {
    if (deleteDialog.id) {
      await handleDelete(deleteDialog.id);
      setDeleteDialog({show: false});
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await handleImport();
        if (e.target) {
          e.target.value = '';
        }
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao importar arquivo'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Empresas</CardTitle>
              <CardDescription>Gerencie as empresas cadastradas no sistema</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleNew} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" /> Nova Empresa
              </Button>
              <Button variant="outline" onClick={() => fileInputRef?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Importar
              </Button>
              <input
                type="file"
                ref={ref => setFileInputRef(ref)}
                className="hidden"
                accept=".csv,.xlsx"
                onChange={handleFileSelect}
              />
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full py-2.5 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </CardContent>
      </Card>

      {hasError && (
        <Card>
          <CardContent className="p-0">
            <ErrorState
              title="Erro ao carregar empresas"
              message={error || "Não foi possível carregar a lista de empresas"}
              onRetry={retry}
              pageId={pageId}
            />
          </CardContent>
        </Card>
      )}

      {loading && !companies.length && (
        <Card>
          <CardContent className="p-0">
            <LoadingState message="Carregando empresas..." pageId={pageId} />
          </CardContent>
        </Card>
      )}

      {!hasError && (!loading || companies.length > 0) && (
        <Card>
          <CardContent className="p-0">
            {loading && companies.length > 0 && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/6">Código</TableHead>
                    <TableHead className="w-1/3">Nome</TableHead>
                    <TableHead className="w-1/6">Documento</TableHead>
                    <TableHead className="w-1/6">Email</TableHead>
                    <TableHead className="w-1/6">Telefone</TableHead>
                    <TableHead className="w-1/6 text-right">Ativo</TableHead>
                    <TableHead className="w-1/6 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isEmpty ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-64">
                        <EmptyState
                          title="Nenhuma empresa encontrada"
                          description={searchTerm 
                            ? "Nenhuma empresa corresponde aos critérios de busca" 
                            : "Cadastre uma nova empresa para começar"
                          }
                          pageId={pageId}
                          action={
                            <Button onClick={handleNew} className="bg-emerald-600 hover:bg-emerald-700">
                              <Plus className="mr-2 h-4 w-4" /> Nova Empresa
                            </Button>
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    companies.map((company) => (
                      <TableRow key={company.company_id} className="hover:bg-gray-50 transition duration-150">
                        <TableCell>{company.company_id}</TableCell>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.document || '-'}</TableCell>
                        <TableCell>{company.email || '-'}</TableCell>
                        <TableCell>{company.phone || '-'}</TableCell>
                        <TableCell className="text-right">
                          {company.enabled ? 'Sim' : 'Não'}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(company.id!)}
                            className="text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50"
                            title="Ver detalhes"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Ver detalhes</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(company.id!)}
                            className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => showDeleteConfirmation(company.id!)}
                            className="text-red-600 hover:text-red-900 hover:bg-red-50"
                            title="Excluir"
                            disabled={isDeleting(company.id!)}
                          >
                            {isDeleting(company.id!) ? (
                              <div className="h-4 w-4 border-2 border-r-transparent border-red-500 rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {!isEmpty && pagination.totalPages > 1 && (
              <div className="border-t">
                <TablePagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialog.show} onOpenChange={(open) => setDeleteDialog({show: open})}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
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