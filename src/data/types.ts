export type StateSlice<TSlice, TSliceKey extends keyof any> = {
  [Key in TSliceKey]: TSlice;
};
