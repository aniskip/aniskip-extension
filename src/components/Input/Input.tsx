import React from 'react';
import { InputProps } from './Input.types';

export function Input({ className, ...props }: InputProps): JSX.Element {
  return (
    <input
      className={`rounded px-3 py-2 block min-w-0 border border-gray-300 focus:outline-none ${className}`}
      type="text"
      autoComplete="off"
      {...props}
    />
  );
}
