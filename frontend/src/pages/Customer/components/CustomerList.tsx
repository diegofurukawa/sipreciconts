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
import { useCustomerList } from '../hooks/useCustomerList';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';

const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const {
    customers,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleDelete,
    reloadCustomers,
    handleExport,
    handleImport,
  } = useCustomerList();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; id?: number }>({ show: false });
  const [importInputRef, setImportInputRef] = useState<HTMLInputElement | null>(null);

  console.log('Estado do useCustomerList:', { customers, loading, error, pagination });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('Termo de busca alterado:', e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submetendo busca com termo:', searchTerm);
    handleSearch(searchTerm);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    console.log('Limpando termo de busca');
    handleSearch('');
  };

  const handleNewClick = () => {
    console.log('Navegando para formulário de novo cliente');
    navigate(CADASTROS_ROUTES.CLIENTES.NEW);
  };

  const handleEditClick = (id: number) => {
    console.log('Navegando para edição do cliente com ID:', id);
    navigate(CADASTROS_ROUTES.CLIENTES.EDIT(id));
  };

  const handleDeleteClick = (id: number) => {
    console.log('Abrindo diálogo de exclusão para cliente com ID:', id);
    setDeleteDialog({ show: true, id });
  };

  const confirmDelete = async () => {
    if (deleteDialog.id) {
      console.log('Confirmando exclusão do cliente com ID:', deleteDialog.id);
      await handleDelete(deleteDialog.id);
    }
    setDeleteDialog({ show: false });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Arquivo selecionado para importação:', file.name);
      try {
        await handleImport(file);
        if (e.target) e.target.value = '';
      } catch (error) {
        console.error('Erro ao importar arquivo:', error);
      }
    }
  };

  if (loading && (!customers || customers.length === 0)) {
    console.log('Exibindo estado de carregamento');
    return <LoadingState />;
  }

  if (error && (!customers || customers.length === 0)) {
    console.log('Exibindo estado de erro:', error);
    return <ErrorState message={error} onRetry={reloadCustomers} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>Gerencie os clientes do sistema</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleNewClick} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" /> Novo Cliente
              </Button>
              <Button 
                variant="outline" 
                onClick={() => { console.log('Abrindo input para importação'); importInputRef?.click(); }}
              >
                <Upload className="mr-2 h-4 w-4" /> Importar
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
                onClick={() => { console.log('Iniciando exportação de clientes'); handleExport(); }}
              >
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
              <Button 
                variant="outline"
                onClick={() => { console.log('Atualizando lista de clientes'); reloadCustomers(); }}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar clientes..."
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

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Celular</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!customers || !Array.isArray(customers)) ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <ErrorState
                        message="Erro: Dados dos clientes inválidos"
                        onRetry={reloadCustomers}
                      />
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <EmptyState
                        title="Nenhum cliente encontrado"
                        description="Cadastre um novo cliente para começar"
                        action={
                          <Button onClick={handleNewClick} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => {
                    console.log('Renderizando cliente:', customer);
                    return (
                      <TableRow key={customer.customer_id || customer.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{customer.customer_id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.document || '-'}</TableCell>
                        <TableCell>{customer.celphone}</TableCell>
                        <TableCell>{customer.email || '-'}</TableCell>
                        <TableCell>{customer.enabled ? 'Sim' : 'Não'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(Number(customer.customer_id))}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(Number(customer.customer_id))}
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

          {customers && Array.isArray(customers) && customers.length > 0 && (
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

      <AlertDialog open={deleteDialog.show} onOpenChange={(open) => setDeleteDialog({ show: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
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

export default CustomerList; // Garantindo a exportação explícita