import React from 'react';
import { ClassNameRender, ComponentPropsWithAs, Render } from '../../utils';

/**
 * Searchbox types.
 */
export const DEFAULT_SEARCHBOX_TAG = React.Fragment;

export type SearchboxProps<TTag extends React.ElementType, TValue> = {
  value?: TValue;
  onChange?: (value: TValue) => void;
} & Omit<ComponentPropsWithAs<TTag>, 'value' | 'onChange'>;

/**
 * Input types.
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const DEFAULT_OPTIONS_TAG = 'ul' as const;

/**
 * Options types.
 */
export type OptionsProps<TTag extends React.ElementType> =
  ComponentPropsWithAs<TTag>;

export const DEFAULT_OPTION_TAG = 'li' as const;

/**
 * Option types.
 */
export type OptionRenderProps = {
  active: boolean;
  selected: boolean;
};

export type OptionProps<TTag extends React.ElementType, TValue> = {
  className?: string | ClassNameRender<OptionRenderProps>;
  children?: React.ReactNode | Render<OptionRenderProps>;
  value?: TValue;
} & Omit<ComponentPropsWithAs<TTag>, 'value' | 'children' | 'className'>;

/**
 * State types.
 */
export type Option = { id: number; value: any };

export type ChangeHandler = (value: any) => void;

export type SearchboxState = {
  onChange: ChangeHandler;
  value: any;
  activeOptionId: number;
  idCounter: number;
  options: Option[];
};
