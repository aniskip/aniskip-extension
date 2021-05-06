import React from 'react';
import { ButtonProps } from '../types/components/button_types';

const Button: React.FC<ButtonProps> = ({
  className,
  children,
  submit,
  onClick,
  onFocus,
}: ButtonProps) => (
  <button
    className={`px-4 py-2 border-transparent rounded text-sm font-semibold focus:outline-none ${className}`}
    type={submit ? 'submit' : 'button'}
    onClick={onClick}
    onFocus={onFocus}
  >
    {children}
  </button>
);

export default Button;
