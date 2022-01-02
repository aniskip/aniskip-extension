import React from 'react';
import { LinkButtonProps } from './LinkButton.types';

export function LinkButton({
  className = '',
  children,
  ...props
}: LinkButtonProps): JSX.Element {
  return (
    <button
      className={`hover:underline focus:outline-none font-semibold ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
