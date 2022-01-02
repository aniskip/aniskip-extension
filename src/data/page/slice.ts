import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { StateSlice } from '../../utils/types';
import { PageState } from './types';

/**
 * Initial state.
 */
const initialPageState: PageState = {
  isOverlayOpen: false,
  isInitialOverlayOpen: false,
  malId: 0,
};

/**
 * Selectors.
 */
export const selectIsOverlayOpen: Selector<
  StateSlice<PageState, 'page'>,
  boolean
> = (state) => state.page.isOverlayOpen;

export const selectMalId: Selector<StateSlice<PageState, 'page'>, number> = (
  state
) => state.page.malId;

export const selectIsInitialOverlayOpen: Selector<
  StateSlice<PageState, 'page'>,
  boolean
> = (state) => state.page.isInitialOverlayOpen;

/**
 * Slice definition.
 */
const pageStateSlice = createSlice({
  name: 'page',
  initialState: initialPageState,
  reducers: {
    overlayOpened: (state) => {
      state.isOverlayOpen = true;
    },
    overlayClosed: (state) => {
      state.isOverlayOpen = false;
    },
    malIdUpdated: (state, action: PayloadAction<number>) => {
      state.malId = action.payload;
    },
    isInitialOverlayOpenUpdated: (state, action: PayloadAction<boolean>) => {
      state.isInitialOverlayOpen = action.payload;
    },
  },
});

export const {
  overlayOpened,
  overlayClosed,
  malIdUpdated,
  isInitialOverlayOpenUpdated,
} = pageStateSlice.actions;
export default pageStateSlice.reducer;
