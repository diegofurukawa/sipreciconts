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
  RefreshCw,
  LogOut,
  CheckCircle,
  XCircle
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
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/auth/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/auth/services/authService';
import { TokenService } from '@/auth/services/TokenService';

// Interface ajustada para corresponder à resposta real da API
interface SessionDetails {
  is_valid: boolean;
  token_type?: string;
  user?: {
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
}

interface TokenInfo {
  access: string;
  refresh: string;
  token_type: string;
  expires_in?: number;
}

const UserSessionInfoPage: React.FC = () => {
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [tokenDecoded, setTokenDecoded] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [logoutProcessing, setLogoutProcessing] = useState(false);
  const { user, signOut, refreshUserInfo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Carregar dados da sessão quando o componente montar
  useEffect(() => {
    fetchSessionDetails();
    loadStoredTokens();
  }, []);

  // Carregar tokens do armazenamento
  const loadStoredTokens = () => {
    const accessToken = TokenService.getAccessToken();
    const refreshToken = TokenService.getRefreshToken();
    
    if (accessToken && refreshToken) {
      setTokenInfo({
        access: accessToken,
        refresh: refreshToken,
        token_type: 'Bearer'
      });
      
      try {
        // Decodificar o token para mostrar informações
        const payload = TokenService.decodeToken(accessToken);
        setTokenDecoded(payload);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
  };

  // Buscar detalhes da sessão via API
  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      // Chama a API para validar a sessão
      const validation = await authService.validate();
      
      // Verifica o formato da resposta e adapta conforme necessário
      if (validation) {
        let sessionInfo: SessionDetails;
        
        // Se for um objeto com a propriedade is_valid
        if (typeof validation === 'object' && 'is_valid' in validation) {
          sessionInfo = validation as SessionDetails;
        } 
        // Se for apenas um booleano
        else if (typeof validation === 'boolean') {
          sessionInfo = {
            is_valid: validation,
            // Usa as informações do usuário atual já disponível no context
            user: user ? {
              id: user.id,
              user_name: user.user_name || user.name,
              email: user.email || '',
              login: user.login,
              type: user.type,
              company: user.company_id,
              company_name: user.company_name || '',
              enabled: user.enabled || true,
              created: '', // Preencher se disponível
              updated: '', // Preencher se disponível
              last_login: user.last_login || ''
            } : undefined,
            token_type: 'Bearer'
          };
        } else {
          throw new Error('Formato de resposta inválido');
        }
        
        setSessionDetails(sessionInfo);
      } else {
        throw new Error('Falha na validação da sessão');
      }
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

  // Renovar token
  const handleRefreshToken = async () => {
    try {
      setRefreshing(true);
      if (!tokenInfo?.refresh) {
        throw new Error('Refresh token não disponível');
      }
      
      const response = await authService.refreshToken(tokenInfo.refresh);
      
      // Atualizar tokenInfo com os novos tokens
      setTokenInfo(prev => ({
        ...prev!,
        access: response.access,
        refresh: response.refresh || prev!.refresh,
        expires_in: response.expires_in
      }));
      
      // Decodificar o novo token
      const payload = TokenService.decodeToken(response.access);
      setTokenDecoded(payload);
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Token renovado com sucesso'
      });
      
      // Atualizar informações da sessão após renovar o token
      await fetchSessionDetails();
    } catch (error) {
      console.error('Error refreshing token:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível renovar o token'
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Validar sessão
  const handleValidateSession = async () => {
    try {
      setValidating(true);
      await fetchSessionDetails();
      
      showToast({
        type: 'success',
        title: 'Sessão Válida',
        message: 'Sua sessão está ativa e válida'
      });
    } catch (error) {
      console.error('Error validating session:', error);
      showToast({
        type: 'error',
        title: 'Sessão Inválida',
        message: 'Sua sessão não é válida ou expirou'
      });
    } finally {
      setValidating(false);
    }
  };

  // Executar logout
  const handleLogout = async () => {
    try {
      setLogoutProcessing(true);
      await signOut(false);
      
      showToast({
        type: 'success',
        title: 'Logout realizado',
        message: 'Você foi desconectado com sucesso'
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao realizar logout'
      });
      setLogoutProcessing(false);
    }
  };

  // Atualizar informações do usuário
  const handleRefreshUserInfo = async () => {
    try {
      setRefreshing(true);
      const updatedUser = await refreshUserInfo();
      
      if (updatedUser) {
        // Atualiza o sessionDetails com as informações atualizadas do usuário
        setSessionDetails(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            user: {
              id: updatedUser.id,
              user_name: updatedUser.user_name || updatedUser.user_name,
              email: updatedUser.email || '',
              login: updatedUser.login,
              type: updatedUser.type,
              company: updatedUser.company_id,
              company_name: updatedUser.company_name || '',
              enabled: updatedUser.enabled || true,
              created: updatedUser.created || '',
              updated: updatedUser.updated || '',
              last_login: updatedUser.last_login || ''
            }
          };
        });
        
        showToast({
          type: 'success',
          title: 'Sucesso',
          message: 'Informações da sessão atualizadas'
        });
      } else {
        // Se não conseguir obter as informações atualizadas, tenta atualizar via API
        await fetchSessionDetails();
      }
    } catch (error) {
      console.error('Error refreshing user info:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar as informações'
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Formatar data
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

  // Formatar token para exibição (mostrar apenas parte)
  const formatToken = (token?: string) => {
    if (!token) return 'N/A';
    if (token.length <= 15) return token;
    return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
  };

  // Renderizar detalhes da sessão
  const renderSessionDetails = () => {
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
            onClick={handleRefreshUserInfo} 
            className="mt-4"
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Tentar novamente
          </Button>
        </div>
      );
    }

    const userData = sessionDetails.user;

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant={sessionDetails.is_valid ? "success" : "destructive"}>
            {sessionDetails.is_valid ? 'Sessão Válida' : 'Sessão Inválida'}
          </Badge>
          <Badge variant="outline">{sessionDetails.token_type || 'Bearer'}</Badge>
        </div>

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

          <div className="flex items-center space-x-3 md:col-span-2">
            <div className="flex items-center">
              {userData.enabled ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="ml-2 text-sm font-medium">
                Usuário {userData.enabled ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar informações do token
  const renderTokenInfo = () => {
    if (!tokenInfo) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500">Nenhuma informação de token disponível</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Access Token</p>
          <div className="mt-1 p-2 bg-gray-50 rounded-md overflow-x-auto">
            <code className="text-xs">{tokenInfo.access}</code>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Refresh Token</p>
          <div className="mt-1 p-2 bg-gray-50 rounded-md overflow-x-auto">
            <code className="text-xs">{tokenInfo.refresh}</code>
          </div>
        </div>

        {tokenDecoded && (
          <div>
            <p className="text-sm font-medium text-gray-500">Token Decodificado</p>
            <div className="mt-1 p-2 bg-gray-50 rounded-md overflow-x-auto">
              <pre className="text-xs">{JSON.stringify(tokenDecoded, null, 2)}</pre>
            </div>
          </div>
        )}

        {tokenInfo.expires_in && (
          <div>
            <p className="text-sm font-medium text-gray-500">Expira em</p>
            <p>{tokenInfo.expires_in} segundos</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Informações da Sessão</h1>
      </div>

      <div className="space-y-6">
        {/* Informações do Usuário e Sessão */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Usuário e Sessão</CardTitle>
            <CardDescription>
              Informações detalhadas sobre sua sessão atual e dados do usuário
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderSessionDetails()}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <p className="text-sm text-gray-500">
              ID do Usuário: {sessionDetails?.user?.id || user?.id || 'N/A'}
            </p>
            <Button 
              onClick={handleRefreshUserInfo}
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Atualizando...' : 'Atualizar Informações'}
            </Button>
          </CardFooter>
        </Card>

        {/* Detalhes do Token */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Token</CardTitle>
            <CardDescription>
              Detalhes sobre os tokens de autenticação da sessão atual
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderTokenInfo()}
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-3 border-t pt-6">
            <Button 
              variant="outline" 
              onClick={handleValidateSession}
              disabled={validating}
            >
              <Shield className="mr-2 h-4 w-4" />
              {validating ? 'Validando...' : 'Validar Sessão'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleRefreshToken}
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Renovando...' : 'Renovar Token'}
            </Button>
            
            <Button 
              variant="destructive"
              onClick={handleLogout}
              disabled={logoutProcessing}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {logoutProcessing ? 'Saindo...' : 'Fazer Logout'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserSessionInfoPage;