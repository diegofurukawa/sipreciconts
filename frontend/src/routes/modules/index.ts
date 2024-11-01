// src/routes/modules/index.ts
export { CadastrosRoutes } from './cadastros.routes';
export { ComercialRoutes } from './comercial.routes';

// Arquivo opcional para tipos comuns das rotas
// src/routes/types.ts
import { RouteObject } from 'react-router-dom';

export interface AppRouteObject extends RouteObject {
  title?: string;
  icon?: React.ComponentType;
  requiredRoles?: string[];
}