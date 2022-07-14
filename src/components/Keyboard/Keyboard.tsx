import React from 'react';
import {
  DEFAULT_KEYBOARD_TAG,
  KeyboardProps,
  KEYBOARD_DISPLAY,
} from './Keyboard.types';

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

    return KEYBOARD_DISPLAY[children] ?? children;
  };

  return React.createElement(
    as,
    {
      className: `flex min-h-[1.5rem] min-w-[1.5rem] items-center justify-center rounded-md border border-gray-200 p-1 text-center text-[0.625rem] font-semibold uppercase ${className}`,
      ...props,
    },
    renderChildren()
  );
}
