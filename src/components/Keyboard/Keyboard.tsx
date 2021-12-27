import React from 'react';
import { KeybindProps } from './Keyboard.types';

export function Keyboard<T extends React.ElementType = 'span'>({
  as,
  className = '',
  ...props
}: KeybindProps<T>): JSX.Element {
  return React.createElement(as ?? 'span', {
    className: `font-semibold uppercase text-[0.625em] border border-gray-200 p-2 rounded-md ${className}`,
    ...props,
  });
}
