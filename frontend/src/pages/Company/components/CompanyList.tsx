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
import { useCompanyList } from '@/pages/Company/hooks/useCompanyList';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';
import { useToast } from '@/hooks/useToast';

const CompanyList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    companies,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleDelete,
    reloadCompanies,
    handleExport,
    handleImport
  } = useCompanyList();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; id?: number }>({ show: false });
  const [importInputRef, setImportInputRef] = useState<HTMLInputElement | null>(null);

  // Log inicial do estado retornado pelo hook
  console.log('Estado do useCompanyList:', {
    companies,
    loading,
    error,
    pagination,
  });

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

  // Navigate to new company form
  const handleNewClick = () => {
    console.log('Navegando para formulário de nova empresa');
    navigate(CADASTROS_ROUTES.EMPRESA.NEW);
  };

  // Função para navegação para a edição de empresa
  const handleEditClick = (id: string) => {
    console.log('Navegando para edição da empresa com ID:', id);
    
    if (!id) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'ID da empresa inválido'
      });
      return;
    }
    
    // Navegando para a rota específica de edição usando o ID
    navigate(CADASTROS_ROUTES.EMPRESA.EDIT(id));
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (id: number) => {
    console.log('Abrindo diálogo de exclusão para empresa com ID:', id);
    setDeleteDialog({ show: true, id });
  };

  // Confirm company deletion
  const confirmDelete = async () => {
    if (deleteDialog.id) {
      console.log('Confirmando exclusão da empresa com ID:', deleteDialog.id);
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
        Nova Empresa
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
      {/* <FileInput
        type="file"
        ref={ref => setImportInputRef(ref)}
        className="hidden"
        accept=".csv,.xlsx"
        onChange={handleFileSelect}
      /> */}

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
          console.log('Iniciando exportação de empresas');
          handleExport();
        }}
      >
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
      <Button 
        variant="outline"
        onClick={() => {
          console.log('Atualizando lista de empresas');
          reloadCompanies();
        }}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Atualizar
      </Button>
    </>
  );

  // Show loading state if loading and no company data
  if (loading && (!companies || companies.length === 0)) {
    console.log('Exibindo estado de carregamento');
    return <LoadingState />;
  }

  // Show error state if there's an error and no company data
  if (error && (!companies || companies.length === 0)) {
    console.log('Exibindo estado de erro:', error);
    return (
      <ErrorState 
        message={error}
        onRetry={reloadCompanies}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        {/* Usando o componente CardHeaderWithActions */}
        <CardHeaderWithActions
          title="Empresas"
          description="Gerencie as empresas do sistema"
          actions={headerActions}
        />
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar empresas..."
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

      {/* Company Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!companies || !Array.isArray(companies)) ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <ErrorState
                        message="Erro: Dados das empresas inválidos"
                        onRetry={reloadCompanies}
                      />
                    </TableCell>
                  </TableRow>
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <EmptyState
                        title="Nenhuma empresa encontrada"
                        description="Cadastre uma nova empresa para começar"
                        action={
                          <Button onClick={handleNewClick} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Empresa
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => {
                    console.log('Renderizando empresa:', company);
                    return (
                      <TableRow key={company.company_id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{company.company_id}</TableCell>
                        <TableCell>{company.name}</TableCell>
                        <TableCell>{company.document || '-'}</TableCell>
                        <TableCell>{company.email || '-'}</TableCell>
                        <TableCell>{company.phone || '-'}</TableCell>
                        <TableCell>{company.enabled ? 'Sim' : 'Não'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(company.company_id)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(company.company_id || company.id)}
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
          {companies && Array.isArray(companies) && companies.length > 0 && (
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
              Tem certeza que deseja excluir esta empresa? 
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

export default CompanyList;