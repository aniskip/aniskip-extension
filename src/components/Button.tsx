import React from 'react';
import classnames from 'classnames';
import { ButtonProps } from '../types/components/button_types';

const Button: React.FC<ButtonProps> = ({
  className,
  onClick,
  label,
  submit,
}: ButtonProps) => (
  <button
    className={classnames(
      'border-none',
      'py-1',
      'px-5',
      'rounded',
      'text-sm',
      'font-semibold',
      'focus:outline-none',
      className
    )}
    type={submit ? 'submit' : 'button'}
    onClick={onClick}
  >
    {label}
  </button>
);

export default Button;
