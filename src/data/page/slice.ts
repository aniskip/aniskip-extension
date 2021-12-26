import { createSlice, Selector } from '@reduxjs/toolkit';
import { StateSlice } from '../../utils';
import { PageState } from './types';

/**
 * Initial state.
 */
const initialPageState: PageState = {
  isOverlayOpen: false,
};

/**
 * Selectors.
 */
export const selectIsOverlayOpen: Selector<
  StateSlice<PageState, 'page'>,
  boolean
> = (state) => state.page.isOverlayOpen;

/**
 * Slice definition.
 */
const pageStateSlice = createSlice({
  name: 'page',
  initialState: initialPageState,
  reducers: {
    openOverlay: (state) => {
      state.isOverlayOpen = true;
    },
    closeOverlay: (state) => {
      state.isOverlayOpen = false;
    },
  },
});

export const { openOverlay, closeOverlay } = pageStateSlice.actions;
export default pageStateSlice.reducer;
