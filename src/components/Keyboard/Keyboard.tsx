import React from 'react';
import {
  HiArrowDown,
  HiArrowLeft,
  HiArrowRight,
  HiArrowUp,
} from 'react-icons/hi';
import { KeybindProps } from './Keyboard.types';

export function Keyboard<T extends React.ElementType = 'span'>({
  as,
  className = '',
  children,
  ...props
}: KeybindProps<T>): JSX.Element {
  /**
   * Renders keybind text.
   */
  const renderChildren = (): JSX.Element | string => {
    if (typeof children !== 'string') {
      return children;
    }

    switch (children) {
      case 'ArrowLeft':
        return <HiArrowLeft />;
      case 'ArrowRight':
        return <HiArrowRight />;
      case 'ArrowUp':
        return <HiArrowUp />;
      case 'ArrowDown':
        return <HiArrowDown />;
      default:
      // no default
    }

    return children;
  };

  return React.createElement(
    as ?? 'span',
    {
      className: `font-semibold uppercase text-[0.625em] border border-gray-200 p-2 rounded-md min-w-[2em] text-center ${className}`,
      ...props,
    },
    renderChildren()
  );
}
