import { forwardRef } from 'react';

/**
 * Hack to allow us to forward refs and perserve the dynamic JSX tags.
 *
 * @param component Component to forward refs.
 */
export const forwardRefTyped = <TComponent>(
  component: TComponent
): TComponent => forwardRef(component as any) as any;
