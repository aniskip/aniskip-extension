import React from 'react';
import { ButtonProps } from '../types/components/button_types';

const Button: React.FC<ButtonProps> = ({
  className,
  label,
  submit,
  onClick,
  onFocus,
}: ButtonProps) => (
  <button
    className={`border-transparent py-2 px-5 rounded text-sm font-semibold focus:outline-none ${className}`}
    type={submit ? 'submit' : 'button'}
    onClick={onClick}
    onFocus={onFocus}
  >
    {label}
  </button>
);

export default Button;
