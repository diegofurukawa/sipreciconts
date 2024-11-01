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
      EMPRESA: '/cadastros/empresa',
      CLIENTES: {
        ROOT: '/cadastros/clientes',
        NOVO: '/cadastros/clientes/novo',
        EDITAR: '/cadastros/clientes/editar',
      },
      IMPOSTOS: {
        ROOT: '/cadastros/impostos',
        NOVO: '/cadastros/impostos/novo',
        EDITAR: '/cadastros/impostos/editar',
      },
      INSUMOS: {
        ROOT: '/cadastros/insumos',
        NOVO: '/cadastros/insumos/novo',
        EDITAR: '/cadastros/insumos/editar',
      }
    },

    COMERCIAL: {
      ORCAMENTOS: {
        ROOT: '/comercial/orcamentos',
        NOVO: '/comercial/orcamentos/novo',
        EDITAR: '/comercial/orcamentos/editar',
      },
      CONTRATOS: {
        ROOT: '/comercial/contratos',
        NOVO: '/comercial/contratos/novo',
        EDITAR: '/comercial/contratos/editar',
      }
    }
  }
} as const;

export type RouteKeys = keyof typeof ROUTES;