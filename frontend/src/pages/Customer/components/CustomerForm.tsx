// src/pages/Customer/components/CustomerForm.tsx
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useToast } from '@/hooks/useToast';
import { customerService } from '@/pages/Customer/services/CustomerService';
import { CUSTOMER_ROUTES } from '@/pages/Customer/routes';
import type { Customer } from '@/pages/Customer/types/CustomerTypes';

// Schema de validação
const customerFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  document: z.string().optional(),
  customer_type: z.string().optional(),
  celphone: z.string().min(1, "Celular é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal('')),
  address: z.string().optional(),
  complement: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

// Opções para selects
const CUSTOMER_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Empresarial' }
];

const CustomerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Converter e validar o ID para evitar NaN
  const parsedId = id ? parseInt(id) : null;
  const isEditMode = !!parsedId && !isNaN(parsedId);
  
  // Logar para depuração
  console.log('CustomerForm - ID da URL:', id);
  console.log('CustomerForm - ID convertido:', parsedId);
  console.log('CustomerForm - Modo de edição:', isEditMode);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(!isEditMode); // Controla o carregamento inicial
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      document: '',
      customer_type: 'individual',
      celphone: '',
      email: '',
      address: '',
      complement: ''
    }
  });

  // Função para carregar dados do cliente
  const loadCustomerData = useCallback(async () => {
    if (!isEditMode || !parsedId) return;
  
    setLoading(true);
    try {
      console.log('Carregando cliente com ID:', parsedId);
      const customer = await customerService.getById(parsedId);
      console.log('Dados completos do cliente recebidos:', customer);
      setCustomerData(customer);
      
      // Adicione logs para cada campo individual para debug
      console.log('name:', customer.name);
      console.log('document:', customer.document);
      console.log('customer_type:', customer.customer_type);
      console.log('celphone:', customer.celphone);
      console.log('email:', customer.email);
      console.log('address:', customer.address);
      console.log('complement:', customer.complement);
      
      // Definir valores usando form.reset para garantir que todos os campos sejam atualizados de uma vez
      form.reset({
        name: customer.name || '',
        document: customer.document || '',
        customer_type: customer.customer_type || 'individual',
        celphone: customer.celphone || '',
        email: customer.email || '',
        address: customer.address || '',
        complement: customer.complement || ''
      });
      
      console.log('Formulário resetado com valores:', form.getValues());
    } catch (error: any) {
      console.error('Erro ao carregar cliente:', error);
      setError(error.message || 'Não foi possível carregar os dados do cliente');
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar dados do cliente'
      });
    } finally {
      setLoading(false);
      setInitialLoad(true);
    }
  }, [isEditMode, parsedId, form, showToast]);

  // Efeito para carregar dados apenas uma vez
  useEffect(() => {
    if (!initialLoad && isEditMode) {
      loadCustomerData();
    }
  }, [initialLoad, isEditMode, loadCustomerData]);

  // Efeito adicional para garantir que os selects sejam atualizados
  useEffect(() => {
    if (customerData && initialLoad) {
      console.log('useEffect de atualização de selects disparado');
      
      // Pequeno timeout para garantir que o DOM esteja pronto
      const timer = setTimeout(() => {
        if (customerData.customer_type) {
          console.log('Forçando atualização do tipo de cliente:', customerData.customer_type);
          form.setValue('customer_type', customerData.customer_type);
        }
        
        form.trigger();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [customerData, initialLoad, form]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setLoading(true);
      
      if (isEditMode && parsedId) {
        console.log('Atualizando cliente com ID:', parsedId, 'Dados:', data);
        await customerService.update(parsedId, data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Cliente atualizado com sucesso'
        });
      } else {
        console.log('Criando novo cliente com dados:', data);
        await customerService.create(data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Cliente criado com sucesso'
        });
      }
      
      navigate(CUSTOMER_ROUTES.ROOT);
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao salvar cliente'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancelando formulário');
    navigate(CUSTOMER_ROUTES.ROOT);
  };

  if (loading && !initialLoad) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => {
          setError(null);
          loadCustomerData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCancel} 
          className="mr-2"
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEditMode ? 'Editar Cliente' : 'Novo Cliente'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Cliente' : 'Novo Cliente'}</CardTitle>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="md:col-span-2">
                <Input
                  label="Nome *"
                  placeholder="Digite o nome completo"
                  error={form.formState.errors.name?.message}
                  {...form.register('name')}
                />
              </div>

              {/* Tipo de Cliente - Usando Controller */}
              <div>
                <Controller
                  name="customer_type"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      label="Tipo de Cliente"
                      placeholder="Selecione o tipo"
                      options={CUSTOMER_TYPES}
                      error={form.formState.errors.customer_type?.message}
                      value={field.value}
                      onChange={(selected) => {
                        console.log('Seleção:', selected);
                        // Se o Select retorna o objeto inteiro {value, label}
                        if (typeof selected === 'object' && selected !== null && 'value' in selected) {
                          field.onChange(selected.value);
                        } 
                        // Se o Select retorna o evento do DOM
                        else if (selected && selected.target && 'value' in selected.target) {
                          field.onChange(selected.target.value);
                        }
                        // Se o Select retorna apenas o valor
                        else {
                          field.onChange(selected);
                        }
                      }}
                    />
                  )}
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

              {/* Endereço - Span 2 colunas */}
              <div className="md:col-span-2">
                <Input
                  label="Endereço"
                  placeholder="Digite o endereço completo"
                  error={form.formState.errors.address?.message}
                  {...form.register('address')}
                />
              </div>

              {/* Complemento - Span 2 colunas */}
              <div className="md:col-span-2">
                <Input
                  label="Complemento"
                  placeholder="Apartamento, sala, etc."
                  error={form.formState.errors.complement?.message}
                  {...form.register('complement')}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 border-t pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CustomerForm;