import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { Reducer } from 'react';
import { SliceActions } from '../../utils';
import { SearchboxState, ChangeHandler } from './Searchbox.types';

/**
 * Initial state.
 */
export const initialSearchboxState: SearchboxState = {
  onChange: () => {},
  activeOption: undefined,
  value: undefined,
};

/**
 * Selectors.
 */
export const selectActiveOption: Selector<SearchboxState, any> = (state) =>
  state.activeOption;

export const selectOnChange: Selector<SearchboxState, ChangeHandler> = (
  state
) => state.onChange;

export const selectValue: Selector<SearchboxState, any> = (state) =>
  state.value;

/**
 * State definition.
 */
const searchboxSlice = createSlice({
  name: 'searchbox',
  initialState: initialSearchboxState,
  reducers: {
    activeOptionUpdated: (state, action: PayloadAction<any>) => {
      state.activeOption = action.payload;
    },
    changeHandlerUpdated: (state, action: PayloadAction<ChangeHandler>) => {
      state.onChange = action.payload;
    },
    valueUpdated: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
});

export type Actions = SliceActions<typeof searchboxSlice.actions>;

export const { activeOptionUpdated, changeHandlerUpdated, valueUpdated } =
  searchboxSlice.actions;
export const { reducer }: { reducer: Reducer<SearchboxState, Actions> } =
  searchboxSlice;
