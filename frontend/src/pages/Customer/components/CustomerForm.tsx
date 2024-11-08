import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
  import { useCustomerForm } from '../hooks/useCustomerForm';
  import type { Customer } from '../types';
  
  interface CustomerFormProps {
    customer?: Customer;
    onSuccess?: () => void;
    onCancel?: () => void;
  }
  
const CustomerForm = ({ 
customer,
onSuccess,
onCancel 
}: CustomerFormProps) => {
const { form, loading, onSubmit } = useCustomerForm(customer, onSuccess);

return (
    <Card>
    <CardHeader>
        <CardTitle>
        {customer ? 'Editar Cliente' : 'Novo Cliente'}
        </CardTitle>
    </CardHeader>
    <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <Input
            label="Nome *"
            error={form.formState.errors.name?.message}
            {...form.register('name')}
            />
        </div>

        <div>
            <Input
            label="Documento"
            error={form.formState.errors.document?.message}
            {...form.register('document')}
            />
        </div>

        <div>
            <Input
            label="Celular *"
            error={form.formState.errors.celphone?.message}
            {...form.register('celphone')}
            />
        </div>

        <div>
            <Input
            type="email"
            label="Email"
            error={form.formState.errors.email?.message}
            {...form.register('email')}
            />
        </div>

        <div>
            <Input
            label="Endereço"
            error={form.formState.errors.address?.message}
            {...form.register('address')}
            />
        </div>

        <div>
            <Input
            label="Complemento"
            error={form.formState.errors.complement?.message}
            {...form.register('complement')}
            />
        </div>

        <div className="flex justify-end space-x-2">
            {onCancel && (
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
            >
                Cancelar
            </Button>
            )}
            <Button
            type="submit"
            disabled={loading}
            >
            {loading ? 'Salvando...' : 'Salvar'}
            </Button>
        </div>
        </form>
    </CardContent>
    </Card>
);
};


export {CustomerForm};