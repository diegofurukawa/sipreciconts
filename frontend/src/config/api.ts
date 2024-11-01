// src/config/app.ts
export const APP_CONFIG = {
  name: 'SiPreciConts',
  version: '1.0.0',
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
  },
  routes: {
    defaultRedirect: '/',
    loginRedirect: '/login',
    notFoundRedirect: '/404',
  },
  layout: {
    sidebarWidth: 280,
    topbarHeight: 64,
  }
} as const;