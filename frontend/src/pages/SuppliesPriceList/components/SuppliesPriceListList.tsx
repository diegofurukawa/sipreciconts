// src/pages/SuppliesPriceList/components/SuppliesPriceListList.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  X,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { 
  Card, 
  CardContent
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
import { FileInput } from '@/components/ui/file-input';
import { TablePagination } from '@/components/ui/table-pagination';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CardHeaderWithActions } from '@/components/CardHeader';
import { LoadingState } from '@/components/feedback/LoadingState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useSuppliesPriceListList } from '@/pages/SuppliesPriceList/hooks';
import { SUPPLIES_PRICE_LIST_ROUTES } from '@/pages/SuppliesPriceList/routes';
import { formatCurrency } from '@/pages/SuppliesPriceList/types';

const SuppliesPriceListList: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleDelete,
    reloadItems,
    handleExport,
    handleImport
  } = useSuppliesPriceListList();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; id?: number }>({ show: false });
  const [importInputRef, setImportInputRef] = useState<HTMLInputElement | null>(null);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  // Clear search input
  const handleSearchClear = () => {
    setSearchTerm('');
    handleSearch('');
  };

  // Navigate to new price item form
  const handleNewClick = () => {
    navigate(SUPPLIES_PRICE_LIST_ROUTES.NEW);
  };

  // Navigate to edit price item form
  const handleEditClick = (id: number) => {
    navigate(SUPPLIES_PRICE_LIST_ROUTES.EDIT(id));
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (id: number) => {
    setDeleteDialog({ show: true, id });
  };

  // Confirm item deletion
  const confirmDelete = async () => {
    if (deleteDialog.id) {
      await handleDelete(deleteDialog.id);
    }
    setDeleteDialog({ show: false });
  };

  // Handle file input change for import
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await handleImport(file);
        // Clear input after upload
        if (e.target) {
          e.target.value = '';
        }
      } catch (error) {
        console.error('Erro ao importar arquivo:', error);
      }
    }
  };

  // Renderizamos os botões de ação como componente separado
  const headerActions = (
    <>
      <Button onClick={handleNewClick} className="bg-emerald-600 hover:bg-emerald-700">
        <Plus className="mr-2 h-4 w-4" />
        Novo Preço
      </Button>
      <Button 
        variant="outline" 
        onClick={() => importInputRef?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Importar
      </Button>
      <FileInput
        ref={ref => setImportInputRef(ref)}
        className="hidden"
        accept=".csv,.xlsx"
        onChange={handleFileSelect}
        label="Importar arquivo"
        hideLabel={true}
      />
      <Button 
        variant="outline"
        onClick={handleExport}
      >
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
      <Button 
        variant="outline"
        onClick={reloadItems}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Atualizar
      </Button>
    </>
  );

  // Loading state
  if (loading && (!items || items.length === 0)) {
    return <LoadingState />;
  }

  // Error state
  if (error && (!items || items.length === 0)) {
    return (
      <ErrorState 
        message={error}
        onRetry={reloadItems}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        {/* Usando o componente CardHeaderWithActions */}
        <CardHeaderWithActions
          title="Lista de Preços de Insumos"
          description="Gerencie os preços de insumos do sistema"
          actions={headerActions}
        />
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar preços por nome de insumo..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full py-2 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            {searchTerm && (
              <Button
                type="button"
                onClick={handleSearchClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Price List Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Insumo</TableHead>
                  <TableHead>Imposto</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Sequência</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!items || !Array.isArray(items)) ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <ErrorState
                        message="Erro: Dados inválidos"
                        onRetry={reloadItems}
                      />
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <EmptyState
                        title="Nenhum preço encontrado"
                        description="Cadastre um novo preço para começar"
                        action={
                          <Button onClick={handleNewClick} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Preço
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.suppliespricelist_id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{item.supply_name}</TableCell>
                      <TableCell>{item.tax_acronym}</TableCell>
                      <TableCell>{formatCurrency(item.value)}</TableCell>
                      <TableCell>{item.sequence}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(item.suppliespricelist_id!)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(item.suppliespricelist_id!)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 ml-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {items && Array.isArray(items) && items.length > 0 && (
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.show} onOpenChange={(open) => setDeleteDialog({ show: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este preço de insumo? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SuppliesPriceListList;