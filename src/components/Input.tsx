import React from 'react';
import { InputProps } from '../types/components/submit_types';

const Input = ({
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
}: InputProps) => (
  <input
    className={`rounded px-3 py-2 block min-w-0 border border-gray-300 focus:outline-none ${className}`}
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
    onKeyDown={onKeyDown}
  />
);

export default Input;
