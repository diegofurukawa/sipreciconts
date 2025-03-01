// src/pages/Tax/components/TaxForm.tsx
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
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
import { TAX_ROUTES } from '../routes';
import { TAX_TYPE_OPTIONS, TAX_GROUP_OPTIONS, CALC_OPERATOR_OPTIONS } from '@/pages/Tax/types/tax_types';

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
  const isEditMode = !!id;
  const [loading, setLoading] = React.useState(isEditMode);
  const [error, setError] = React.useState<string | null>(null);
  
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

  // Carregar dados se estiver em modo de edição
  useEffect(() => {
    const loadTax = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const tax = await taxService.getById(parseInt(id));
          form.reset({
            acronym: tax.acronym,
            description: tax.description,
            type: tax.type,
            group: tax.group,
            calc_operator: tax.calc_operator,
            value: tax.value
          });
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
        }
      }
    };

    loadTax();
  }, [id, isEditMode, form, showToast]);

  const onSubmit = async (data: TaxFormData) => {
    try {
      setLoading(true);
      
      if (isEditMode && id) {
        await taxService.update(parseInt(id), data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Imposto atualizado com sucesso'
        });
      } else {
        await taxService.create(data);
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Imposto criado com sucesso'
        });
      }
      
      // Navegar de volta para a lista após o sucesso
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

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => navigate(TAX_ROUTES.ROOT)}
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

              {/* Tipo */}
              <div>
                <Select
                  label="Tipo *"
                  placeholder="Selecione um tipo"
                  options={TAX_TYPE_OPTIONS}
                  error={form.formState.errors.type?.message}
                  {...form.register('type')}
                />
              </div>

              {/* Grupo */}
              <div>
                <Select
                  label="Grupo *"
                  placeholder="Selecione um grupo"
                  options={TAX_GROUP_OPTIONS}
                  error={form.formState.errors.group?.message}
                  {...form.register('group')}
                />
              </div>

              {/* Operador de Cálculo */}
              <div>
                <Select
                  label="Operador de Cálculo *"
                  placeholder="Selecione um operador"
                  options={CALC_OPERATOR_OPTIONS}
                  error={form.formState.errors.calc_operator?.message}
                  {...form.register('calc_operator')}
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