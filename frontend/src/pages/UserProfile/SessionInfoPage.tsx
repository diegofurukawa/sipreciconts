// src/pages/UserProfile/SessionInfoPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  UserIcon, 
  Building2, 
  Clock, 
  Calendar, 
  Mail, 
  Shield, 
  Key, 
  RefreshCw 
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
import { useAuth } from '@/auth/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/auth/services/authService';

interface SessionDetails {
  is_valid: boolean;
  user: {
    id: number;
    user_name: string;
    email: string;
    login: string;
    type: string;
    company: string;
    company_name: string;
    enabled: boolean;
    created: string;
    updated: string;
    last_login: string;
  };
  token_type: string;
}

const UserSessionInfoPage: React.FC = () => {
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, refreshUserInfo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessionDetails();
  }, []);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const validation = await authService.validate();
      setSessionDetails(validation as SessionDetails);
    } catch (error) {
      console.error('Error fetching session details:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os detalhes da sessão'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshUserInfo();
      await fetchSessionDetails();
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Informações da sessão atualizadas'
      });
    } catch (error) {
      console.error('Error refreshing session info:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar as informações'
      });
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR
      });
    } catch (e) {
      return 'Data inválida';
    }
  };

  const renderUserDetails = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!sessionDetails || !sessionDetails.user) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500">Informações da sessão não disponíveis</p>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            className="mt-4"
            disabled={refreshing}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      );
    }

    const userData = sessionDetails.user;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <UserIcon className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Nome de Usuário</p>
              <p className="text-lg font-medium">{userData.user_name}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Key className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Login</p>
              <p className="text-lg">{userData.login}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg">{userData.email || 'Não disponível'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Tipo de Usuário</p>
              <p className="text-lg">{userData.type}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Building2 className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Empresa</p>
              <p className="text-lg">{userData.company_name} ({userData.company})</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Último Login</p>
              <p className="text-lg">{formatDate(userData.last_login)}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Adicionais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Calendar className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Data de Criação</p>
                <p className="text-base">{formatDate(userData.created)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Última Atualização</p>
                <p className="text-base">{formatDate(userData.updated)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 md:col-span-2">
              <Shield className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo de Token</p>
                <p className="text-base">{sessionDetails.token_type}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Status: {sessionDetails.is_valid ? 
                    <span className="text-green-500 font-medium">Válido</span> : 
                    <span className="text-red-500 font-medium">Inválido</span>
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Informações da Sessão</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Usuário e Sessão</CardTitle>
          <CardDescription>
            Informações detalhadas sobre sua sessão atual e dados do usuário
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderUserDetails()}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-gray-500">
            ID do Usuário: {sessionDetails?.user?.id || user?.id || 'N/A'}
          </p>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing || loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar Informações'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserSessionInfoPage;