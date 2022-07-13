import React from 'react';
import { InputProps } from './Input.types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    // False positive.
    // eslint-disable-next-line react/prop-types
    { className = '', ...props }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ): JSX.Element => (
    <input
      className={`block min-w-0 rounded border border-gray-300 px-3 py-2 focus:outline-none ${className}`}
      ref={ref}
      type="text"
      autoComplete="off"
      {...props}
    />
  )
);
