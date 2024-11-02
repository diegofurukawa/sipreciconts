// src/routes/types.ts
import type { RouteObject } from 'react-router-dom';
import type { ComponentType } from 'react';

export interface AppRouteObject extends RouteObject {
  title?: string;
  icon?: ComponentType;
  requiredRoles?: string[];
}
