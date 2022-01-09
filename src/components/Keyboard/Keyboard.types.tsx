import React from 'react';
import {
  HiArrowDown,
  HiArrowLeft,
  HiArrowRight,
  HiArrowUp,
} from 'react-icons/hi';
import { ComponentPropsWithAs } from '../../utils';

export type KeyboardProps<TTag extends React.ElementType> =
  ComponentPropsWithAs<TTag>;

export const DEFAULT_KEYBOARD_TAG = 'span' as const;

export const KEYBOARD_DISPLAY: Record<string, React.ReactNode> = {
  ArrowUp: <HiArrowUp />,
  ArrowDown: <HiArrowDown />,
  ArrowLeft: <HiArrowLeft />,
  ArrowRight: <HiArrowRight />,
  Control: 'Ctrl',
  Backspace: '⌫',
  Delete: 'Del',
  Escape: 'Esc',
  PageUp: 'PgUp',
  PageDown: 'PgDn',
  Space: '␣',
} as const;
