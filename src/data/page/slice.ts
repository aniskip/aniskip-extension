import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { StateSlice } from '../../utils/types';
import { PageState } from './types';

/**
 * Initial state.
 */
const initialPageState: PageState = {
  isAnimeCorrectionOverlayOpen: false,
  malId: 0,
};

/**
 * Selectors.
 */
export const selectIsOverlayOpen: Selector<
  StateSlice<PageState, 'page'>,
  boolean
> = (state) => state.page.isAnimeCorrectionOverlayOpen;

export const selectMalId: Selector<StateSlice<PageState, 'page'>, number> = (
  state
) => state.page.malId;

/**
 * Slice definition.
 */
const pageStateSlice = createSlice({
  name: 'page',
  initialState: initialPageState,
  reducers: {
    overlayOpened: (state) => {
      state.isAnimeCorrectionOverlayOpen = true;
    },
    overlayClosed: (state) => {
      state.isAnimeCorrectionOverlayOpen = false;
    },
    malIdUpdated: (state, action: PayloadAction<number>) => {
      state.malId = action.payload;
    },
    pageStateReset: () => initialPageState,
  },
});

export const { overlayOpened, overlayClosed, malIdUpdated, pageStateReset } =
  pageStateSlice.actions;
export default pageStateSlice.reducer;
