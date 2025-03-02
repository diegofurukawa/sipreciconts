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
  X 
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
import { LoadingState } from '@/components/feedback/LoadingState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useTaxList } from '@/pages/Tax/hooks/useTaxList';
import { useToast } from '@/hooks/useToast';
import { TAX_ROUTES } from '@/pages/Tax/routes';
import { formatTaxValue, getOptionLabel, TAX_TYPE_LABELS, TAX_GROUP_LABELS, CALC_OPERATOR_LABELS } from '@/pages/Tax/types/tax_types';

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

  const handleNewClick = useCallback(() => {
    navigate(TAX_ROUTES.NEW);
  }, [navigate]);

  const handleEditClick = useCallback((id: number) => {
    // Garantindo que o ID seja válido antes de navegar
    if (id !== undefined && id !== null && !isNaN(Number(id))) {
      console.log('Navegando para edição do imposto:', id);
      navigate(TAX_ROUTES.EDIT(id));
    } else {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'ID do imposto inválido'
      });
    }
  }, [navigate, showToast]);

  const handleDeleteClick = useCallback((id: number) => {
    // Garantindo que o ID seja válido antes de abrir o diálogo
    if (id !== undefined && id !== null && !isNaN(Number(id))) {
      setDeleteDialog({ show: true, id });
    } else {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'ID do imposto inválido'
      });
    }
  }, [showToast]);

  const confirmDelete = async () => {
    if (deleteDialog.id) {
      await handleDelete(deleteDialog.id);
    }
    setDeleteDialog({ show: false });
  };

  const handleExportClick = async () => {
    try {
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await handleImport(file);
        // Limpar input após envio
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

  if (loading && !taxes.length) {
    return <LoadingState />;
  }

  if (error && !taxes.length) {
    return (
      <ErrorState 
        message={error}
        onRetry={reloadTaxes}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Impostos e Taxas</CardTitle>
              <CardDescription>Gerencie os impostos e taxas do sistema</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleNewClick} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Novo Imposto
              </Button>
              <Button 
                variant="outline" 
                onClick={() => importInputRef?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </Button>
              <input
                type="file"
                ref={ref => setImportInputRef(ref)}
                className="hidden"
                accept=".csv,.xlsx"
                onChange={handleFileSelect}
              />
              <Button 
                variant="outline"
                onClick={handleExportClick}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
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

      {/* Tabela de Impostos */}
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
                {taxes.length === 0 ? (
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
                  taxes.map((tax) => (
                    <TableRow key={tax.id} className="hover:bg-gray-50">
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
                          onClick={() => {
                            console.log('Tax data on edit click:', tax);
                            if (tax && tax.id !== undefined && tax.id !== null) {
                              handleEditClick(tax.id);
                            } else {
                              showToast({
                                type: 'error',
                                title: 'Erro',
                                message: 'Não foi possível editar: dados do imposto incompletos'
                              });
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (tax && tax.id !== undefined && tax.id !== null) {
                              handleDeleteClick(tax.id);
                            } else {
                              showToast({
                                type: 'error',
                                title: 'Erro',
                                message: 'Não foi possível excluir: dados do imposto incompletos'
                              });
                            }
                          }}
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

          {taxes.length > 0 && (
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

      {/* Diálogo de Confirmação de Exclusão */}
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