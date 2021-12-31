import React from 'react';
import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { SliceActions } from '../../utils';
import { SearchboxState, ChangeHandler, Option } from './Searchbox.types';

/**
 * Initial state.
 */
export const initialSearchboxState: SearchboxState = {
  onChange: () => {},
  activeOptionId: -1,
  value: undefined,
  idCounter: 0,
  options: [],
};

/**
 * Selectors.
 */
export const selectOptionByValue = (
  options: Option[],
  value: any
): Option | undefined => options.find((option) => option.value === value);

export const selectActiveOptionId: Selector<SearchboxState, number> = (state) =>
  state.activeOptionId;

export const selectOnChange: Selector<SearchboxState, ChangeHandler> = (
  state
) => state.onChange;

export const selectValue: Selector<SearchboxState, any> = (state) =>
  state.value;

export const selectIdCounter: Selector<SearchboxState, number> = (state) =>
  state.idCounter;

export const selectOptions: Selector<SearchboxState, Option[]> = (state) =>
  state.options;

export const selectActiveOption: Selector<
  SearchboxState,
  Option | undefined
> = (state) => {
  const activeOptionId = selectActiveOptionId(state);

  return state.options.find((option) => option.id === activeOptionId);
};

/**
 * State definition.
 */
const searchboxSlice = createSlice({
  name: 'searchbox',
  initialState: initialSearchboxState,
  reducers: {
    activeOptionIdUpdated: (state, action: PayloadAction<number>) => {
      state.activeOptionId = action.payload;
    },
    changeHandlerUpdated: (state, action: PayloadAction<ChangeHandler>) => {
      state.onChange = action.payload;
    },
    optionAdded: (state, action: PayloadAction<any>) => {
      state.options.push({ id: state.idCounter, value: action.payload });
      state.idCounter += 1;
    },
    optionRemoved: (state, action: PayloadAction<number>) => {
      state.options = state.options.filter(
        (option) => option.id !== action.payload
      );
      state.idCounter -= 1;
    },
    valueUpdated: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
    nextOptionActivated: (state) => {
      for (let i = 0; i < state.options.length; i += 1) {
        const option = state.options[i];

        if (option.id > state.activeOptionId) {
          state.activeOptionId = option.id;

          return;
        }
      }
    },
    previousOptionActivated: (state) => {
      for (let i = state.options.length - 1; i >= 0; i -= 1) {
        const option = state.options[i];

        if (option.id < state.activeOptionId) {
          state.activeOptionId = option.id;

          return;
        }
      }
    },
  },
});

export type Actions = SliceActions<typeof searchboxSlice.actions>;

export const {
  activeOptionIdUpdated,
  changeHandlerUpdated,
  optionAdded,
  optionRemoved,
  valueUpdated,
  nextOptionActivated,
  previousOptionActivated,
} = searchboxSlice.actions;
export const { reducer }: { reducer: React.Reducer<SearchboxState, Actions> } =
  searchboxSlice;
