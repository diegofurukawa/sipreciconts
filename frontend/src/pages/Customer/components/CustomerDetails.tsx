// src/pages/Customer/components/CustomerDetails.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Edit, 
  ArrowLeft, 
  Trash, 
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useToast } from '@/hooks/useToast';
import { CustomerService } from '@/services/api';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';
import type { Customer } from '../types';

interface CustomerDetailsProps {
  customerId: string;
}

const CustomerDetails = ({ customerId }: CustomerDetailsProps) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      const data = await CustomerService.getById(Number(customerId));
      setCustomer(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar dados do cliente'
      });
      navigate(CADASTROS_ROUTES.CLIENTES.ROOT);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await CustomerService.delete(Number(customerId));
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Cliente excluído com sucesso'
      });
      navigate(CADASTROS_ROUTES.CLIENTES.ROOT);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao excluir cliente'
      });
    }
    setShowDeleteDialog(false);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!customer) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Cliente não encontrado</h3>
              <p className="text-sm text-gray-500">
                Não foi possível encontrar os dados do cliente solicitado.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(CADASTROS_ROUTES.CLIENTES.ROOT)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para lista
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(CADASTROS_ROUTES.CLIENTES.ROOT)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Detalhes do Cliente</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(CADASTROS_ROUTES.CLIENTES.EDIT(customerId))}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Dados do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>{customer.name}</CardTitle>
          <CardDescription>
            {customer.customer_type || 'Cliente Individual'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customer.document && (
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Documento</p>
                  <p>{customer.document}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Celular</p>
                <p>{customer.celphone}</p>
              </div>
            </div>

            {customer.email && (
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{customer.email}</p>
                </div>
              </div>
            )}

            {customer.address && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Endereço</p>
                  <p>{customer.address}</p>
                  {customer.complement && (
                    <p className="text-sm text-gray-500">{customer.complement}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Datas */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Data de Cadastro
                  </p>
                  <p>{formatDate(customer.created!)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Última Atualização
                  </p>
                  <p>{formatDate(customer.updated!)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50">
          <p className="text-sm text-gray-500">
            ID do Cliente: {customer.customer_id}
          </p>
        </CardFooter>
      </Card>

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export {CustomerDetails};