/**
 * General types related to components
 */

import type { ReactNode } from 'react';

export interface IPropsWithForcedChildren {
  children: ReactNode;
}

export enum FormMode {
  CREATE,
  UPDATE,
  PATCH,
}

export interface IFormMode {
  mode: FormMode;
}
