// src/pages/UserProfile/index.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, Settings, Key, Shield } from 'lucide-react';
import { useAuth } from '@/auth/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Você precisa estar logado para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Perfil do Usuário</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <UserIcon className="mr-2 h-5 w-5 text-emerald-500" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Visualize e edite suas informações pessoais</p>
            <Button 
              className="mt-4"
              variant="outline"
              onClick={() => navigate('/perfil/pessoal')}
            >
              Gerenciar
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5 text-emerald-500" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Altere sua senha e configure a segurança da conta</p>
            <Button 
              className="mt-4"
              variant="outline"
              onClick={() => navigate('/perfil/seguranca')}
            >
              Gerenciar
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-emerald-500" />
              Preferências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Configure suas preferências de uso do sistema</p>
            <Button 
              className="mt-4"
              variant="outline"
              onClick={() => navigate('/perfil/preferencias')}
            >
              Gerenciar
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-emerald-500" />
              Detalhes da Sessão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Visualize informações detalhadas da sua sessão atual</p>
            <Button 
              className="mt-4"
              variant="outline"
              onClick={() => navigate('/perfil/session')}
            >
              Visualizar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;