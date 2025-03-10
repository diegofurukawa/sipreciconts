// src/pages/Company/components/CompanyForm.tsx
import React, { useEffect, useCallback } from 'react';
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
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useToast } from '@/hooks/useToast';
import { companyService } from '@/pages/Company/services/CompanyService';
import { CADASTROS_ROUTES } from '@/routes/modules/cadastros.routes';

// Schema de validação
const companyFormSchema = z.object({
  company_id: z.string().min(1, "Código é obrigatório").max(10, "Máximo 10 caracteres"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  document: z.string().min(1, "CNPJ é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  enabled: z.boolean().default(true)
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

const CompanyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Determinar se estamos em modo de edição
  // Não convertemos para número, apenas verificamos se existe um ID na URL e se não é "novo"
  const isEditMode = !!id && id !== 'novo';
  
  // Logar para depuração
  console.log('CompanyForm - ID da URL:', id);
  console.log('CompanyForm - Modo de edição:', isEditMode);
  
  const [loading, setLoading] = React.useState(isEditMode);
  const [error, setError] = React.useState<string | null>(null);
  const [initialLoad, setInitialLoad] = React.useState(!isEditMode); // Controla o carregamento inicial
  const [companyData, setCompanyData] = React.useState<any | null>(null);
  
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      company_id: '',
      name: '',
      document: '',
      email: '',
      phone: '',
      address: '',
      enabled: true
    }
  });

  // Função para formatar o CNPJ no formato XX.XXX.XXX/XXXX-XX
  const formatCNPJ = (value: string) => {
    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Formata o CNPJ
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    } else if (numbers.length <= 12) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    } else {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    }
  };

  // Função para carregar dados da empresa
  const loadCompanyData = useCallback(async () => {
    if (!isEditMode || !id) return;
  
    setLoading(true);
    try {
      console.log('Carregando empresa com ID:', id);
      
      // Passamos o ID diretamente para o serviço, sem conversão para número
      const company = await companyService.getById(id);
      
      console.log('Dados completos da empresa recebidos:', company);
      setCompanyData(company);
      
      // Adicione logs para cada campo individual para debug
      console.log('company_id:', company.company_id);
      console.log('name:', company.name);
      console.log('document:', company.document);
      console.log('email:', company.email);
      console.log('phone:', company.phone);
      console.log('address:', company.address);
      console.log('enabled:', company.enabled);
      
      // Definir valores usando form.reset para garantir que todos os campos sejam atualizados de uma vez
      form.reset({
        company_id: company.company_id || '',
        name: company.name || '',
        document: company.document || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        enabled: company.enabled !== undefined ? company.enabled : true
      });
      
      console.log('Formulário resetado com valores:', form.getValues());
    } catch (error: any) {
      console.error('Erro ao carregar empresa:', error);
      setError(error.message || 'Não foi possível carregar os dados da empresa');
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar dados da empresa'
      });
    } finally {
      setLoading(false);
      setInitialLoad(true);
    }
  }, [isEditMode, id, form, showToast]);

  // Efeito para carregar dados apenas uma vez
  useEffect(() => {
    if (!initialLoad && isEditMode) {
      loadCompanyData();
    }
  }, [initialLoad, isEditMode, loadCompanyData]);

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setLoading(true);
      
      // Para CNPJ, remover formatação antes de enviar
      const cleanedData = {
        ...data,
        document: data.document?.replace(/\D/g, '')
      };
      
      if (isEditMode && id) {
        console.log('Atualizando empresa com ID:', id, 'Dados:', cleanedData);
        
        // Passamos o ID diretamente para o serviço, sem conversão para número
        await companyService.update(id, cleanedData);
        
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Empresa atualizada com sucesso'
        });
      } else {
        console.log('Criando nova empresa com dados:', cleanedData);
        await companyService.create(cleanedData);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Empresa criada com sucesso'
        });
      }
      
      navigate(CADASTROS_ROUTES.EMPRESA.ROOT);
    } catch (error: any) {
      console.error('Erro ao salvar empresa:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao salvar empresa'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(CADASTROS_ROUTES.EMPRESA.ROOT);
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
          loadCompanyData();
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
          {isEditMode ? 'Editar Empresa' : 'Nova Empresa'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Empresa' : 'Nova Empresa'}</CardTitle>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Seção de Identificação */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-md">Identificação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Código da Empresa */}
                <div>
                  <Input
                    label="Código da Empresa *"
                    placeholder="Ex: COMP01"
                    error={form.formState.errors.company_id?.message}
                    {...form.register('company_id')}
                    disabled={isEditMode} // Desabilita em modo de edição
                  />
                  <p className="mt-1 text-xs text-gray-500">Código único de identificação da empresa</p>
                </div>

                {/* Nome da Empresa */}
                <div>
                  <Input
                    label="Nome da Empresa *"
                    placeholder="Nome completo da empresa"
                    error={form.formState.errors.name?.message}
                    {...form.register('name')}
                  />
                </div>

                {/* CNPJ */}
                <div>
                  <Controller
                    name="document"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        label="CNPJ *"
                        placeholder="00.000.000/0001-00"
                        error={form.formState.errors.document?.message}
                        value={field.value}
                        onChange={(e) => {
                          const formatted = formatCNPJ(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Seção de Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-md">Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Telefone */}
                <div>
                  <Input
                    label="Telefone"
                    placeholder="(00) 0000-0000"
                    error={form.formState.errors.phone?.message}
                    {...form.register('phone')}
                  />
                </div>

                {/* Email */}
                <div>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="email@empresa.com"
                    error={form.formState.errors.email?.message}
                    {...form.register('email')}
                  />
                </div>
                
                {/* Endereço - Span 2 colunas */}
                <div className="col-span-1 md:col-span-2">
                  <Input
                    label="Endereço"
                    placeholder="Endereço completo da empresa"
                    error={form.formState.errors.address?.message}
                    {...form.register('address')}
                  />
                </div>
              </div>
            </div>

            {/* Seção de Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-md">Status</h3>
              <div className="flex items-center space-x-2">
                <Controller
                  name="enabled"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enabled"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label
                        htmlFor="enabled"
                        className="ml-2 text-sm font-medium text-gray-700"
                      >
                        Empresa ativa
                      </label>
                    </div>
                  )}
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

export default CompanyForm;