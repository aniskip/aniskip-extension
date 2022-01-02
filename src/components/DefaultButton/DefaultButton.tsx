import React from 'react';
import { DefaultButtonProps } from './DefaultButton.types';

export function DefaultButton({
  className = '',
  children,
  submit,
  ...props
}: DefaultButtonProps): JSX.Element {
  return (
    <button
      className={`px-4 py-2 border-transparent rounded text-sm font-semibold focus:outline-none ${className}`}
      type={submit ? 'submit' : 'button'}
      {...props}
    >
      {children}
    </button>
  );
}
