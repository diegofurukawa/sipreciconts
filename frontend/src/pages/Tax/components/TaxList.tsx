// src/pages/Tax/components/TaxList.tsx
import React, { useState, useCallback } from 'react';
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
import { useTaxList } from '@/pages/Tax/hooks/useTaxList';
import { useToast } from '@/hooks/useToast';
import { TAX_ROUTES } from '@/pages/Tax/routes';
import { formatTaxValue, getOptionLabel, TAX_TYPE_LABELS, TAX_GROUP_LABELS, CALC_OPERATOR_LABELS } from '@/pages/Tax/types/TaxTypes';

const TaxList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    taxes,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleDelete,
    reloadTaxes,
    handleExport,
    handleImport
  } = useTaxList();

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

  // Navigate to new tax form
  const handleNewClick = useCallback(() => {
    console.log('Navegando para formulário de novo imposto');
    navigate(TAX_ROUTES.NEW);
  }, [navigate]);

  // Navigate to edit tax form
  const handleEditClick = useCallback((id: number) => {
    if (id !== undefined && id !== null && !isNaN(Number(id))) {
      console.log('Navegando para edição do imposto com ID:', id);
      navigate(TAX_ROUTES.EDIT(id));
    } else {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'ID do imposto inválido'
      });
    }
  }, [navigate, showToast]);

  // Open delete confirmation dialog
  const handleDeleteClick = useCallback((id: number) => {
    if (id !== undefined && id !== null && !isNaN(Number(id))) {
      console.log('Abrindo diálogo de exclusão para imposto com ID:', id);
      setDeleteDialog({ show: true, id });
    } else {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'ID do imposto inválido'
      });
    }
  }, [showToast]);

  // Confirm tax deletion
  const confirmDelete = async () => {
    if (deleteDialog.id) {
      console.log('Confirmando exclusão do imposto com ID:', deleteDialog.id);
      await handleDelete(deleteDialog.id);
    }
    setDeleteDialog({ show: false });
  };

  // Handle export button click
  const handleExportClick = async () => {
    try {
      console.log('Iniciando exportação de impostos');
      await handleExport();
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Impostos exportados com sucesso'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao exportar impostos'
      });
    }
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
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Impostos importados com sucesso'
        });
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao importar impostos'
        });
      }
    }
  };

  // Renderizamos os botões de ação como componente separado
  const headerActions = (
    <>
      <Button onClick={handleNewClick} className="bg-emerald-600 hover:bg-emerald-700">
        <Plus className="mr-2 h-4 w-4" />
        Novo Imposto
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
        onClick={handleExportClick}
      >
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
      <Button 
        variant="outline"
        onClick={() => {
          console.log('Atualizando lista de impostos');
          reloadTaxes();
        }}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Atualizar
      </Button>
    </>
  );

  // Show loading state if loading and no tax data
  if (loading && (!taxes || taxes.length === 0)) {
    console.log('Exibindo estado de carregamento');
    return <LoadingState />;
  }

  // Show error state if there's an error and no tax data
  if (error && (!taxes || taxes.length === 0)) {
    console.log('Exibindo estado de erro:', error);
    return (
      <ErrorState 
        message={error}
        onRetry={reloadTaxes}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        {/* Usando o componente CardHeaderWithActions */}
        <CardHeaderWithActions
          title="Impostos e Taxas"
          description="Gerencie os impostos e taxas do sistema"
          actions={headerActions}
        />
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar impostos..."
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

      {/* Tax Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sigla</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Operador</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!taxes || !Array.isArray(taxes)) ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <ErrorState
                        message="Erro: Dados dos impostos inválidos"
                        onRetry={reloadTaxes}
                      />
                    </TableCell>
                  </TableRow>
                ) : taxes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <EmptyState
                        title="Nenhum imposto encontrado"
                        description="Cadastre um novo imposto para começar"
                        action={
                          <Button onClick={handleNewClick} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Imposto
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  taxes.map((tax) => {
                    console.log('Renderizando imposto:', tax);
                    return (
                      <TableRow key={tax.tax_id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{tax.acronym}</TableCell>
                        <TableCell>{getOptionLabel(tax.type, TAX_TYPE_LABELS)}</TableCell>
                        <TableCell>{getOptionLabel(tax.group, TAX_GROUP_LABELS)}</TableCell>
                        <TableCell>{getOptionLabel(tax.calc_operator, CALC_OPERATOR_LABELS)}</TableCell>
                        <TableCell>{formatTaxValue(tax.value, tax.calc_operator)}</TableCell>
                        <TableCell>{tax.description || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(tax.tax_id!)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(tax.tax_id!)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 ml-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {taxes && Array.isArray(taxes) && taxes.length > 0 && (
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
              Tem certeza que deseja excluir este imposto? 
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

export default TaxList;