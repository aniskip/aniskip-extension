import React from 'react';
import { LinkButtonProps } from './LinkButton.types';

export function LinkButton({
  className = '',
  children,
  ...props
}: LinkButtonProps): JSX.Element {
  return (
    <button
      className={`font-semibold hover:underline focus:outline-none ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
