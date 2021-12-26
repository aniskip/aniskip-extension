import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { StateSlice } from '../../utils';
import { PageState } from './types';

/**
 * Initial state.
 */
const initialPageState: PageState = {
  malId: 0,
  episodeNumber: 0,
  isOverlayOpen: false,
};

/**
 * Selectors.
 */
export const selectIsOverlayOpen: Selector<
  StateSlice<PageState, 'page'>,
  boolean
> = (state) => state.page.isOverlayOpen;

export const selectEpisodeNumber: Selector<
  StateSlice<PageState, 'page'>,
  number
> = (state) => state.page.episodeNumber;

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
    openOverlay: (state) => {
      state.isOverlayOpen = true;
    },
    closeOverlay: (state) => {
      state.isOverlayOpen = false;
    },
    setEpisodeNumber: (state, action: PayloadAction<number>) => {
      state.episodeNumber = action.payload;
    },
    setMalId: (state, action: PayloadAction<number>) => {
      state.malId = action.payload;
    },
  },
});

export const { openOverlay, closeOverlay, setEpisodeNumber, setMalId } =
  pageStateSlice.actions;
export default pageStateSlice.reducer;
