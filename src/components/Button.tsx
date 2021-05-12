import React from 'react';
import { ButtonProps } from '../types/components/button_types';

const Button = ({
  className,
  children,
  submit,
  disabled,
  onClick,
  onFocus,
}: ButtonProps) => (
  <button
    className={`px-4 py-2 border-transparent rounded text-sm font-semibold focus:outline-none ${className}`}
    type={submit ? 'submit' : 'button'}
    onClick={onClick}
    onFocus={onFocus}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
