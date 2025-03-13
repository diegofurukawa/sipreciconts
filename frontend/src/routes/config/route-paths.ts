// src/routes/config/route-paths.ts
import { COMPANY_ROUTES } from '@/pages/Company/routes';
import { CUSTOMER_ROUTES } from '@/pages/Customer/routes';
import { TAX_ROUTES } from '@/pages/Tax/routes';
import { SUPPLY_ROUTES } from '@/pages/Supply/routes';
import { SUPPLIES_PRICE_LIST_ROUTES } from '@/pages/SuppliesPriceList/routes';
import { USER_ROUTES } from '@/pages/User/routes';

export const ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  
  PRIVATE: {
    HOME: '/',
    DASHBOARD: '/dashboard',
    
    USER_PROFILE: {
      ROOT: '/perfil',
      SESSION: '/perfil/session',
      SECURITY: '/perfil/seguranca',
      PREFERENCES: '/perfil/preferencias',
      PERSONAL: '/perfil/pessoal',
    },
    
    CADASTROS: {
      EMPRESA: COMPANY_ROUTES,
      CLIENTES: CUSTOMER_ROUTES,
      IMPOSTOS: TAX_ROUTES,
      INSUMOS: SUPPLY_ROUTES,
      LISTA_PRECOS: SUPPLIES_PRICE_LIST_ROUTES,
      USUARIOS: USER_ROUTES
    },

    COMERCIAL: {
      ORCAMENTOS: {
        ROOT: '/comercial/orcamentos',
        NOVO: '/comercial/orcamentos/novo',
        EDITAR: (id: string | number) => `/cadastros/orcamentos/${id}`,
        DETALHES: (id: string | number) => `/cadastros/orcamentos/${id}/detalhes`,
        APROVAR: (id: string | number) => `/cadastros/orcamentos/${id}/aprovar`,
        REPROVAR: (id: string | number) => `/cadastros/orcamentos/${id}/reprovar`,
        GERAR_CONTRATO: (id: string | number) => `/cadastros/orcamentos/${id}/gerar-contrato`,
      },
      CONTRATOS: {
        ROOT: '/comercial/contratos',
        NOVO: '/comercial/contratos/novo',
        EDITAR: (id: string | number) => `/comercial/contratos/${id}`,
        DETALHES: (id: string | number) => `/comercial/contratos/${id}/detalhes`,
        ASSINAR: (id: string | number) => `/comercial/contratos/${id}/assinar`,
        CANCELAR: (id: string | number) => `/comercial/contratos/${id}/cancelar`,
        RENOVAR: (id: string | number) => `/comercial/contratos/${id}/renovar`,
        ADITIVO: {
          NOVO: (id: string | number) => `/comercial/contratos/${id}/aditivo/novo`,
          EDITAR: (contratoId: string | number, aditivoId: string | number) => 
            `/comercial/contratos/${contratoId}/aditivo/${aditivoId}`,
        },
      }
    },

    CONFIGURACOES: {
      ROOT: '/configuracoes',
      PERFIL: '/configuracoes/perfil',
      USUARIOS: {
        ROOT: '/configuracoes/usuarios',
        NOVO: '/configuracoes/usuarios/novo',
        EDITAR: (id: string | number) => `/configuracoes/usuarios/${id}`,
      },
      PERMISSOES: {
        ROOT: '/configuracoes/permissoes',
        NOVO: '/configuracoes/permissoes/novo',
        EDITAR: (id: string | number) => `/configuracoes/permissoes/${id}`,
      },
      EMPRESA: '/configuracoes/empresa',
      NOTIFICACOES: '/configuracoes/notificacoes',
    },

    RELATORIOS: {
      ROOT: '/relatorios',
      VENDAS: '/relatorios/vendas',
      CONTRATOS: '/relatorios/contratos',
      CLIENTES: '/relatorios/clientes',
      FINANCEIRO: '/relatorios/financeiro',
    },

    AJUDA: {
      ROOT: '/ajuda',
      DOCUMENTACAO: '/ajuda/documentacao',
      SUPORTE: '/ajuda/suporte',
    },

  }
} as const;

// Tipos úteis para type safety
export type RouteKeys = keyof typeof ROUTES;
export type PublicRouteKeys = keyof typeof ROUTES.PUBLIC;
export type PrivateRouteKeys = keyof typeof ROUTES.PRIVATE;

// Helper type para extrair o tipo de uma rota específica
export type RouteType<T extends RouteKeys> = typeof ROUTES[T];

// Helper function para type safety ao navegar
export const getRoute = <T extends RouteKeys>(key: T): RouteType<T> => ROUTES[key];