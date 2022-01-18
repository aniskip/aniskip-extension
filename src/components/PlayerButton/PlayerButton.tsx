import React from 'react';
import { PlayerButtonProps } from './PlayerButton.types';

export function PlayerButton({
  className = '',
  children,
  ...props
}: PlayerButtonProps): JSX.Element {
  return (
    <button
      className={`font-sans w-8 h-8 cursor-pointer select-none outline-none flex items-center justify-center transition-colors ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
