// src/routes/types.ts
import { ReactNode } from 'react';

export interface AppRouteObject {
  path: string;
  element: ReactNode;
  title?: string;
  children?: AppRouteObject[];
  index?: boolean;
}