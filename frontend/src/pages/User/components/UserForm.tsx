// src/pages/User/components/UserForm.tsx
import React from 'react';
import { Controller } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useUserForm } from '@/pages/User/hooks';
import { USER_TYPES } from '@/pages/User/types';

const UserForm: React.FC = () => {
  const {
    form,
    loading,
    error,
    isEditMode,
    onSubmit,
    handleCancel
  } = useUserForm();
  
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => window.location.reload()}
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
          {isEditMode ? 'Editar Usuário' : 'Novo Usuário'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Usuário' : 'Novo Usuário'}</CardTitle>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Seção de Informações Principais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-md">Informações Principais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome do Usuário */}
                <div className="md:col-span-2">
                  <Input
                    label="Nome do Usuário *"
                    placeholder="Nome completo do usuário"
                    error={form.formState.errors.user_name?.message}
                    {...form.register('user_name')}
                  />
                </div>

                {/* E-mail */}
                <div>
                  <Input
                    label="E-mail *"
                    type="email"
                    placeholder="exemplo@email.com"
                    error={form.formState.errors.email?.message}
                    {...form.register('email')}
                  />
                </div>

                {/* Login */}
                <div>
                  <Input
                    label="Login *"
                    placeholder="Nome de usuário"
                    error={form.formState.errors.login?.message}
                    disabled={isEditMode} // Não permitir edição do login
                    {...form.register('login')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isEditMode ? 'O login não pode ser alterado' : 'Escolha um nome de usuário único'}
                  </p>
                </div>

                {/* Senha */}
                <div>
                  <Input
                    label={isEditMode ? "Senha (deixe em branco para manter)" : "Senha *"}
                    type="password"
                    placeholder={isEditMode ? "••••••••" : "Digite a senha"}
                    error={form.formState.errors.password?.message}
                    {...form.register('password')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A senha deve ter pelo menos 8 caracteres
                  </p>
                </div>

                {/* Tipo de Usuário */}
                <div>
                  <Controller
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        label="Tipo *"
                        placeholder="Selecione um tipo"
                        options={USER_TYPES}
                        error={form.formState.errors.type?.message}
                        value={field.value}
                        onChange={(selected) => {
                          // Lida com diferentes formatos de resposta do componente Select
                          if (typeof selected === 'object' && selected !== null && 'value' in selected) {
                            field.onChange(selected.value);
                          } else if (selected && selected.target && 'value' in selected.target) {
                            field.onChange(selected.target.value);
                          } else {
                            field.onChange(selected);
                          }
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Seção de Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-md">Status</h3>
              
              <div className="flex items-center space-x-2">
                <Controller
                  name="is_active"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center">
                      <Switch
                        id="is_active"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="is_active"
                        className="ml-2 text-sm font-medium text-gray-700"
                      >
                        Usuário ativo
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
              disabled={form.formState.isSubmitting || loading}
            >
              {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;