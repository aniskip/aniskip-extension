import { ComponentPropsWithAs } from '../../utils';

export type KeyboardProps<TTag extends React.ElementType> =
  ComponentPropsWithAs<TTag>;

export const DEFAULT_KEYBOARD_TAG = 'span' as const;
