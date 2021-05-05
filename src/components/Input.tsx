import React from 'react';
import { InputProps } from '../types/components/submit_types';

const Input: React.FC<InputProps> = ({
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
}: InputProps) => (
  <input
    className={`rounded px-4 py-2 block min-w-0 border border-gray-300 focus:outline-none ${className}`}
    type="text"
    id={id}
    autoComplete="off"
    value={value}
    pattern={pattern}
    title={title}
    placeholder={placeholder}
    required={required}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
  />
);

export default Input;
