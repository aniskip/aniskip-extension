import React from 'react';
import {
  HiArrowDown,
  HiArrowLeft,
  HiArrowRight,
  HiArrowUp,
} from 'react-icons/hi';
import { DEFAULT_KEYBOARD_TAG, KeyboardProps } from './Keyboard.types';

export function Keyboard<
  TTag extends React.ElementType = typeof DEFAULT_KEYBOARD_TAG
>({
  as = DEFAULT_KEYBOARD_TAG as TTag,
  className = '',
  children,
  ...props
}: KeyboardProps<TTag>): JSX.Element {
  /**
   * Renders keybind text.
   */
  const renderChildren = (): React.ReactNode => {
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
    as,
    {
      className: `font-semibold uppercase text-[0.625em] border border-gray-200 p-2 rounded-md min-w-[2em] text-center ${className}`,
      ...props,
    },
    renderChildren()
  );
}
