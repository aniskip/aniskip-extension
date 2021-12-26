import React from 'react';
import { KeybindProps } from './Keyboard.types';

export function Keyboard<T extends React.ElementType = 'div'>({
  as,
  className,
  ...props
}: KeybindProps<T>): JSX.Element {
  return React.createElement(as ?? 'div', {
    className: `font-semibold uppercase text-[0.625em] border border-gray-200 p-2 rounded-md hover:shadow-md hover:border-gray-300 active:border-gray-400 ${className}`,
    ...props,
  });
}
