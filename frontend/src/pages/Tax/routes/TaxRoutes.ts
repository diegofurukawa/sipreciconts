export const TAX_ROUTES = {
  ROOT: '/cadastros/impostos',
  NEW: '/cadastros/impostos/novo',
  EDIT: (id: string | number) => `/cadastros/impostos/${id}/editar`,
  DETAILS: (id: string | number) => `/cadastros/impostos/${id}`,
} as const;