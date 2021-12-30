export type StateSlice<TSlice, TSliceKey extends keyof any> = {
  [Key in TSliceKey]: TSlice;
};

export type SliceActions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer A ? A : never;
}[keyof T];

export type ComponentPropsWithAs<TTag extends React.ElementType> = {
  as?: TTag;
  children?: React.ReactNode;
} & Omit<React.ComponentProps<TTag>, 'children'>;
