// src/pages/Supply/components/SupplyList.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  Upload, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  X,
  RefreshCw 
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
import { useSupplyList } from '@/pages/Supply/hooks';
import { SUPPLY_ROUTES } from '@/pages/Supply/routes';

const SupplyList: React.FC = () => {
  const navigate = useNavigate();
  const {
    supplies,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleDelete,
    reloadSupplies,
    handleExport,
    handleImport
  } = useSupplyList();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; id?: number }>({ show: false });
  const [importInputRef, setImportInputRef] = useState<HTMLInputElement | null>(null);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('Termo de busca alterado:', e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submetendo busca com termo:', searchTerm);
    handleSearch(searchTerm);
  };

  // Clear search input
  const handleSearchClear = () => {
    setSearchTerm('');
    console.log('Limpando termo de busca');
    handleSearch('');
  };

  // Navigate to new supply form
  const handleNewClick = () => {
    console.log('Navegando para formulário de novo insumo');
    navigate(SUPPLY_ROUTES.NEW);
  };

  // Navigate to edit supply form
  const handleEditClick = (id: number) => {
    console.log('Navegando para edição do insumo com ID:', id);
    navigate(SUPPLY_ROUTES.EDIT(id));
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (id: number) => {
    console.log('Abrindo diálogo de exclusão para insumo com ID:', id);
    setDeleteDialog({ show: true, id });
  };

  // Confirm supply deletion
  const confirmDelete = async () => {
    if (deleteDialog.id) {
      console.log('Confirmando exclusão do insumo com ID:', deleteDialog.id);
      await handleDelete(deleteDialog.id);
    }
    setDeleteDialog({ show: false });
  };

  // Handle file input change for import
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Arquivo selecionado para importação:', file.name);
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
        Novo Insumo
      </Button>
      <Button 
        variant="outline" 
        onClick={() => {
          console.log('Abrindo input para importação');
          importInputRef?.click();
        }}
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
        onClick={() => {
          console.log('Iniciando exportação de insumos');
          handleExport();
        }}
      >
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
      <Button 
        variant="outline"
        onClick={() => {
          console.log('Atualizando lista de insumos');
          reloadSupplies();
        }}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Atualizar
      </Button>
    </>
  );

  // Show loading state if loading and no supply data
  if (loading && (!supplies || supplies.length === 0)) {
    console.log('Exibindo estado de carregamento');
    return <LoadingState />;
  }

  // Show error state if there's an error and no supply data
  if (error && (!supplies || supplies.length === 0)) {
    console.log('Exibindo estado de erro:', error);
    return (
      <ErrorState 
        message={error}
        onRetry={reloadSupplies}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        {/* Usando o componente CardHeaderWithActions */}
        <CardHeaderWithActions
          title="Insumos"
          description="Gerencie os insumos do sistema"
          actions={headerActions}
        />
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar insumos..."
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

      {/* Supply Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Apelido</TableHead>
                  <TableHead>Código EAN</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Un. Medida</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!supplies || !Array.isArray(supplies)) ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <ErrorState
                        message="Erro: Dados dos insumos inválidos"
                        onRetry={reloadSupplies}
                      />
                    </TableCell>
                  </TableRow>
                ) : supplies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <EmptyState
                        title="Nenhum insumo encontrado"
                        description="Cadastre um novo insumo para começar"
                        action={
                          <Button onClick={handleNewClick} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Insumo
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  supplies.map((supply) => (
                    <TableRow key={supply.supply_id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{supply.name}</TableCell>
                      <TableCell>{supply.nick_name || '-'}</TableCell>
                      <TableCell>{supply.ean_code || '-'}</TableCell>
                      <TableCell>{supply.type_display || supply.type}</TableCell>
                      <TableCell>{supply.unit_measure_display || supply.unit_measure}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(supply.supply_id!)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(supply.supply_id!)}
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
          {supplies && Array.isArray(supplies) && supplies.length > 0 && (
            <div className="border-t">
              <TablePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => {
                  console.log('Mudando para página:', page);
                  handlePageChange(page);
                }}
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
              Tem certeza que deseja excluir este insumo? 
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

export default SupplyList;