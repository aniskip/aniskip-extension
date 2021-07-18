import React from 'react';
import { DefaultButtonProps } from './DefaultButton.types';

export const DefaultButton = ({
  className,
  children,
  title,
  submit,
  disabled,
  onClick,
  onFocus,
}: DefaultButtonProps): JSX.Element => (
  <button
    className={`px-4 py-2 border-transparent rounded text-sm font-semibold focus:outline-none ${className}`}
    type={submit ? 'submit' : 'button'}
    title={title}
    onClick={onClick}
    onFocus={onFocus}
    disabled={disabled}
  >
    {children}
  </button>
);
