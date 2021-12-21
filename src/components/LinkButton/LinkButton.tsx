import React from 'react';
import { LinkButtonProps } from './LinkButton.types';

export function LinkButton({
  className,
  children,
  onClick,
}: LinkButtonProps): JSX.Element {
  return (
    <button
      className={`hover:underline focus:outline-none font-semibold ${className}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
