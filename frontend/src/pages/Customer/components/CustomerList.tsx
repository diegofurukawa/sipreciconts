import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search,
  ArrowUpDown,
  Phone,
  Mail,
  FileText,
  Eye,
  Edit,
  Trash,
  X
} from 'lucide-react';
import { useCustomerList } from '../hooks/useCustomerList';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';
import { ImportHelpDialog } from './ImportHelpDialog';
import { FeedbackMessage } from './FeedbackMessage';
import { CustomerToolbar } from './CustomerToolbar';

const CustomerList = () => {
  const navigate = useNavigate();
  const {
    customers,
    loading,
    pagination,
    params,
    handleSearch,
    handlePageChange,
    handleSort,
    handleExport,
    handleDelete,
    handleImport,
    reloadCustomers
  } = useCustomerList();

  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
  const [showImportHelp, setShowImportHelp] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Handlers
  const handleExportClick = async () => {
    try {
      await handleExport();
      showFeedback('success', 'Arquivo exportado com sucesso');
    } catch (error) {
      showFeedback('error', 'Erro ao exportar clientes');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await handleImport(file);
        showFeedback('success', 'Clientes importados com sucesso');
        await reloadCustomers();
      } catch (error) {
        showFeedback('error', 'Erro ao importar clientes');
      }
    }
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await handleDelete(customerToDelete);
        showFeedback('success', 'Cliente excluído com sucesso');
        await reloadCustomers();
      } catch (error) {
        showFeedback('error', 'Erro ao excluir cliente');
      }
      setCustomerToDelete(null);
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSearchSubmit = useCallback(() => {
    handleSearch(searchTerm);
  }, [handleSearch, searchTerm]);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
    handleSearch('');
  }, [handleSearch]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Renderiza o esqueleto de carregamento
  if (loading && !customers.length) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <div className="space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Card>
          <CardContent className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho com Ações */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex items-center w-full md:w-auto">
          <Search className="absolute left-3 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Pesquisar clientes..."
            className="w-full md:w-[320px] pl-10 pr-24"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="absolute right-1 flex items-center space-x-1">
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleSearchClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="h-7"
              onClick={handleSearchSubmit}
            >
              Pesquisar
            </Button>
          </div>
        </div>

        {/* Nova Toolbar */}
        <CustomerToolbar 
          onExport={handleExportClick}
          onImport={() => document.getElementById('importInput')?.click()}
          onHelpClick={() => setShowImportHelp(true)}
          onNewCustomer={() => navigate(CADASTROS_ROUTES.CLIENTES.NEW)}
        />

        <input
          id="importInput"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-64">
                  <Button 
                    variant="ghost" 
                    className="p-0 hover:bg-transparent"
                    onClick={() => handleSort('name', params.sort_order === 'asc' ? 'desc' : 'asc')}
                  >
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>Documento</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>Celular</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </div>
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Nenhum cliente encontrado</p>
                      <p className="text-sm text-gray-500">
                        Comece adicionando um novo cliente ou ajuste seus filtros de busca.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.customer_id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.document || '-'}</TableCell>
                    <TableCell>{customer.celphone}</TableCell>
                    <TableCell>{customer.email || '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(
                          CADASTROS_ROUTES.CLIENTES.DETAILS(customer.customer_id.toString())
                        )}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(
                          CADASTROS_ROUTES.CLIENTES.EDIT(customer.customer_id.toString())
                        )}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCustomerToDelete(customer.customer_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginação */}
      {customers.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Total de {pagination.total} clientes
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                />
              </PaginationItem>
              <PaginationItem>
                Página {pagination.currentPage} de {pagination.totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog 
        open={!!customerToDelete} 
        onOpenChange={() => setCustomerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação pode ser desfeita
              posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de ajuda para importação */}
      <ImportHelpDialog
        open={showImportHelp}
        onClose={() => setShowImportHelp(false)}
      />

      {/* Mensagem de feedback */}
      {feedback && (
        <FeedbackMessage
          type={feedback.type}
          message={feedback.message}
        />
      )}
    </div>
  );
};

export {  CustomerList };