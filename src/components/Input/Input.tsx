import React from 'react';
import { InputProps } from './Input.types';

export const Input = ({
  className,
  value,
  id,
  pattern,
  title,
  placeholder,
  required,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
}: InputProps): JSX.Element => (
  <input
    className={`rounded px-3 py-2 block min-w-0 border border-gray-300 focus:outline-none ${className}`}
    type="text"
    autoComplete="off"
    {...{
      id,
      value,
      pattern,
      title,
      placeholder,
      required,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
    }}
  />
);
