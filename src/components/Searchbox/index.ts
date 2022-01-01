import { SearchboxProps as Props } from './Searchbox.types';

export * from './Searchbox';
export type SearchboxProps<TTag extends React.ElementType, TValue> = Props<
  TTag,
  TValue
>;
