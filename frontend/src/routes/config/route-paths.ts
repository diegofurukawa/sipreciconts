// src/routes/config/route-paths.ts

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
    
    CADASTROS: {
      EMPRESA: {
        ROOT: '/cadastros/empresa',
        NOVO: '/cadastros/empresa/novo',
        EDITAR: (id: string | number) => `/cadastros/empresa/${id}`,
        DETALHES: (id: string | number) => `/cadastros/empresa/${id}/detalhes`,
      },
      CLIENTES: {
        ROOT: '/cadastros/clientes',
        NOVO: '/cadastros/clientes/novo',
        EDITAR: (id: string | number) => `/cadastros/clientes/${id}`,
        DETALHES: (id: string | number) => `/cadastros/clientes/${id}/detalhes`,
        IMPORTAR: '/cadastros/clientes/importar',
      },
      IMPOSTOS: {
        ROOT: '/cadastros/impostos',
        NOVO: '/cadastros/impostos/novo',
        EDITAR: (id: string | number) => `/cadastros/impostos/${id}`,
        DETALHES: (id: string | number) => `/cadastros/impostos/${id}/detalhes`,
      },
      INSUMOS: {
        ROOT: '/cadastros/insumos',
        NOVO: '/cadastros/insumos/novo',
        EDITAR: (id: string | number) => `/cadastros/insumos/${id}`,
        DETALHES: (id: string | number) => `/cadastros/insumos/${id}/detalhes`,
        CATEGORIAS: {
          ROOT: '/cadastros/insumos/categorias',
          NOVO: '/cadastros/insumos/categorias/novo',
          EDITAR: (id: string | number) => `/cadastros/insumos/categorias/${id}`,
        },
      }
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
    }
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