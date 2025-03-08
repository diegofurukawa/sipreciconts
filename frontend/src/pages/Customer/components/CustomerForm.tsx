import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useCustomerForm } from '../hooks/useCustomerForm';
import { useNavigate } from 'react-router-dom';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';
import type { Customer } from '../types/index';

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CUSTOMER_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Empresarial' }
];

const CustomerForm = ({ 
  customer,
  onSuccess,
  onCancel 
}: CustomerFormProps) => {
  const navigate = useNavigate();
  const { form, loading, onSubmit } = useCustomerForm({
    customer,
    onSuccess: () => {
      console.log('Formulário salvo com sucesso');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(CADASTROS_ROUTES.CLIENTES.ROOT);
      }
    },
    onError: (error) => {
      console.error('Erro ao salvar cliente:', error);
    }
  });

  const handleCancel = () => {
    console.log('Cancelando formulário');
    if (onCancel) {
      onCancel();
    } else {
      navigate(CADASTROS_ROUTES.CLIENTES.ROOT);
    }
  };

  console.log('Renderizando CustomerForm, customer:', customer, 'loading:', loading);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {customer ? 'Editar Cliente' : 'Novo Cliente'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="md:col-span-2">
              <Input
                label="Nome *"
                placeholder="Digite o nome"
                error={form.formState.errors.name?.message}
                {...form.register('name')}
              />
            </div>

            {/* Tipo de Cliente */}
            <div>
              <Select
                label="Tipo de Cliente"
                placeholder="Selecione o tipo"
                error={form.formState.errors.customer_type?.message}
                options={CUSTOMER_TYPES}
                {...form.register('customer_type')}
              />
            </div>

            {/* Documento */}
            <div>
              <Input
                label="Documento"
                placeholder="CPF/CNPJ"
                error={form.formState.errors.document?.message}
                {...form.register('document')}
              />
            </div>

            {/* Celular */}
            <div>
              <Input
                label="Celular *"
                placeholder="(00) 00000-0000"
                error={form.formState.errors.celphone?.message}
                {...form.register('celphone')}
              />
            </div>

            {/* Email */}
            <div>
              <Input
                type="email"
                label="Email"
                placeholder="exemplo@email.com"
                error={form.formState.errors.email?.message}
                {...form.register('email')}
              />
            </div>

            {/* Endereço */}
            <div className="md:col-span-2">
              <Input
                label="Endereço"
                placeholder="Digite o endereço completo"
                error={form.formState.errors.address?.message}
                {...form.register('address')}
              />
            </div>

            {/* Complemento */}
            <div className="md:col-span-2">
              <Input
                label="Complemento"
                placeholder="Apartamento, sala, etc."
                error={form.formState.errors.complement?.message}
                {...form.register('complement')}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;