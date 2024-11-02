// src/pages/Company/routes.ts
export const COMPANY_ROUTES = {
    LIST: '/cadastros/empresa',
    NEW: '/cadastros/empresa/nova',
    EDIT: (id: number) => `/cadastros/empresa/${id}`,
  } as const;