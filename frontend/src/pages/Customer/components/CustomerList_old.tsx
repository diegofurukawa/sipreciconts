// src/pages/Customer/components/CustomerList.tsx
import { useState } from 'react';
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
  Plus, 
  Download, 
  Upload,
  Edit,
  Trash,
  ArrowUpDown,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { useCustomerList } from '../hooks/useCustomerList';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';

export const CustomerList = () => {
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
    handleDelete
  } = useCustomerList();

  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);

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
        <div className="border rounded-lg">
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho com Ações */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-500" />
          <Input
            placeholder="Pesquisar clientes..."
            className="w-64"
            value={params.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={loading}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(CADASTROS_ROUTES.CLIENTES.IMPORT)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button
            onClick={() => navigate(CADASTROS_ROUTES.CLIENTES.NEW)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="border rounded-lg">
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
                  <TableCell>{customer.document}</TableCell>
                  <TableCell>{customer.celphone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell className="text-right space-x-2">
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
      </div>

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
              onClick={() => {
                if (customerToDelete) {
                  handleDelete(customerToDelete);
                  setCustomerToDelete(null);
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerList;