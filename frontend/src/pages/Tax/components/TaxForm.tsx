// src/pages/Tax/components/TaxForm.tsx
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
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useToast } from '@/hooks/useToast';
import { taxService } from '@/pages/Tax/services/TaxService';
import { TAX_ROUTES } from '@/pages/Tax/routes';
import { Tax, TAX_TYPE_OPTIONS, TAX_GROUP_OPTIONS, CALC_OPERATOR_OPTIONS } from '@/pages/Tax/types/TaxTypes';

// Schema de validação
const taxFormSchema = z.object({
  acronym: z.string().min(1, "Sigla é obrigatória").max(10, "Máximo 10 caracteres"),
  description: z.string().optional(),
  type: z.string().min(1, "Tipo é obrigatório"),
  group: z.string().min(1, "Grupo é obrigatório"),
  calc_operator: z.string().min(1, "Operador é obrigatório"),
  value: z.number().min(0, "Valor não pode ser negativo")
});

type TaxFormData = z.infer<typeof taxFormSchema>;

const TaxForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Converter e validar o ID para evitar NaN
  const parsedId = id ? parseInt(id) : null;
  const isEditMode = !!parsedId && !isNaN(parsedId);
  
  // Logar para depuração
  console.log('TaxForm - ID da URL:', id);
  console.log('TaxForm - ID convertido:', parsedId);
  console.log('TaxForm - Modo de edição:', isEditMode);
  
  const [loading, setLoading] = React.useState(isEditMode);
  const [error, setError] = React.useState<string | null>(null);
  const [initialLoad, setInitialLoad] = React.useState(!isEditMode); // Controla o carregamento inicial
  const [taxData, setTaxData] = React.useState<Tax | null>(null);
  
  const form = useForm<TaxFormData>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      acronym: '',
      description: '',
      type: 'tax',
      group: 'federal',
      calc_operator: '%',
      value: 0
    }
  });

  // Função para carregar dados do imposto
  const loadTaxData = useCallback(async () => {
    if (!isEditMode || !parsedId) return;
  
    setLoading(true);
    try {
      console.log('Carregando imposto com ID:', parsedId);
      const tax = await taxService.getById(parsedId);
      console.log('Dados completos do imposto recebidos:', tax);
      setTaxData(tax);
      
      // Adicione logs para cada campo individual para debug
      console.log('acronym:', tax.acronym);
      console.log('description:', tax.description);
      console.log('type:', tax.type);
      console.log('group:', tax.group);
      console.log('calc_operator:', tax.calc_operator);
      console.log('value:', tax.value);
      
      // Definir valores usando form.reset para garantir que todos os campos sejam atualizados de uma vez
      form.reset({
        acronym: tax.acronym || '',
        description: tax.description || '',
        type: tax.type || 'tax',
        group: tax.group || 'federal',
        calc_operator: tax.calc_operator || '%',
        value: typeof tax.value === 'string' ? parseFloat(tax.value) : (tax.value || 0)
      });
      
      console.log('Formulário resetado com valores:', form.getValues());
    } catch (error: any) {
      console.error('Erro ao carregar imposto:', error);
      setError(error.message || 'Não foi possível carregar os dados do imposto');
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao carregar dados do imposto'
      });
    } finally {
      setLoading(false);
      setInitialLoad(true);
    }
  }, [isEditMode, parsedId, form, showToast]);

  // Efeito para carregar dados apenas uma vez
  useEffect(() => {
    if (!initialLoad && isEditMode) {
      loadTaxData();
    }
  }, [initialLoad, isEditMode, loadTaxData]);

  // Efeito adicional para garantir que os selects sejam atualizados
  useEffect(() => {
    if (taxData && initialLoad) {
      console.log('useEffect de atualização de selects disparado');
      
      // Pequeno timeout para garantir que o DOM esteja pronto
      const timer = setTimeout(() => {
        if (taxData.type) {
          console.log('Forçando atualização do tipo:', taxData.type);
          form.setValue('type', taxData.type);
        }
        
        if (taxData.group) {
          console.log('Forçando atualização do grupo:', taxData.group);
          form.setValue('group', taxData.group);
        }
        
        if (taxData.calc_operator) {
          console.log('Forçando atualização do operador:', taxData.calc_operator);
          form.setValue('calc_operator', taxData.calc_operator);
        }
        
        form.trigger();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [taxData, initialLoad, form]);

  const onSubmit = async (data: TaxFormData) => {
    try {
      setLoading(true);
      
      if (isEditMode && parsedId) {
        console.log('Atualizando imposto com ID:', parsedId, 'Dados:', data);
        await taxService.update(parsedId, data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Imposto atualizado com sucesso'
        });
      } else {
        console.log('Criando novo imposto com dados:', data);
        await taxService.create(data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Imposto criado com sucesso'
        });
      }
      
      navigate(TAX_ROUTES.ROOT);
    } catch (error: any) {
      console.error('Erro ao salvar imposto:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao salvar imposto'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(TAX_ROUTES.ROOT);
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
          loadTaxData();
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
          {isEditMode ? 'Editar Imposto' : 'Novo Imposto'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Imposto' : 'Novo Imposto'}</CardTitle>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sigla */}
              <div>
                <Input
                  label="Sigla *"
                  placeholder="Ex: ICMS"
                  error={form.formState.errors.acronym?.message}
                  {...form.register('acronym')}
                />
              </div>

              {/* Valor */}
              <div>
                <Input
                  label="Valor *"
                  type="number"
                  step="0.01"
                  error={form.formState.errors.value?.message}
                  {...form.register('value', { valueAsNumber: true })}
                />
              </div>

              {/* Tipo - Usando Controller */}
              <div>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      label="Tipo *"
                      placeholder="Selecione um tipo"
                      options={TAX_TYPE_OPTIONS}
                      error={form.formState.errors.type?.message}
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

              {/* Grupo - Usando Controller */}
              <div>
                <Controller
                  name="group"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      label="Grupo *"
                      placeholder="Selecione um grupo"
                      options={TAX_GROUP_OPTIONS}
                      error={form.formState.errors.group?.message}
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

              {/* Operador de Cálculo - Usando Controller */}
              <div>
                <Controller
                  name="calc_operator"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      label="Operador de Cálculo *"
                      placeholder="Selecione um operador"
                      options={CALC_OPERATOR_OPTIONS}
                      error={form.formState.errors.calc_operator?.message}
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

              {/* Descrição - Span 2 colunas */}
              <div className="col-span-1 md:col-span-2">
                <Input
                  label="Descrição"
                  placeholder="Descrição detalhada do imposto"
                  error={form.formState.errors.description?.message}
                  {...form.register('description')}
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

export default TaxForm;