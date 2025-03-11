// src/pages/User/components/UserList.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  X,
  RefreshCw,
  CheckCircle,
  XCircle
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
import { Badge } from '@/components/ui/badge';
import { useUserList } from '@/pages/User/hooks';
import { USER_ROUTES } from '@/pages/User/routes';
import { USER_TYPE_LABELS, formatDate } from '@/pages/User/types';

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const {
    users,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleDelete,
    reloadUsers
  } = useUserList();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; id?: number }>({ show: false });

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

  // Navigate to new user form
  const handleNewClick = () => {
    navigate(USER_ROUTES.NEW);
  };

  // Navigate to edit user form
  const handleEditClick = (id: number) => {
    navigate(USER_ROUTES.EDIT(id));
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (id: number) => {
    setDeleteDialog({ show: true, id });
  };

  // Confirm user deletion
  const confirmDelete = async () => {
    if (deleteDialog.id) {
      await handleDelete(deleteDialog.id);
    }
    setDeleteDialog({ show: false });
  };

  // Show loading state if loading and no user data
  if (loading && (!users || users.length === 0)) {
    return <LoadingState />;
  }

  // Show error state if there's an error and no user data
  if (error && (!users || users.length === 0)) {
    return (
      <ErrorState 
        message={error}
        onRetry={reloadUsers}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Usuários</CardTitle>
              <CardDescription>Gerencie os usuários do sistema</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleNewClick} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  reloadUsers();
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar usuários..."
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

      {/* User Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Login</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!users || !Array.isArray(users)) ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <ErrorState
                        message="Erro: Dados dos usuários inválidos"
                        onRetry={reloadUsers}
                      />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <EmptyState
                        title="Nenhum usuário encontrado"
                        description="Cadastre um novo usuário para começar"
                        action={
                          <Button onClick={handleNewClick} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Usuário
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{user.login}</TableCell>
                      <TableCell>{user.user_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {USER_TYPE_LABELS[user.type] || user.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.company?.name || '-'}</TableCell>
                      <TableCell>
                        {user.is_active ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span>Ativo</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            <span>Inativo</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{user.last_login ? formatDate(user.last_login) : 'Nunca'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(user.id!)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(user.id!)}
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
          {users && Array.isArray(users) && users.length > 0 && (
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
              Tem certeza que deseja excluir este usuário? 
              Este usuário será desativado, mas seus dados serão mantidos no sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserList;