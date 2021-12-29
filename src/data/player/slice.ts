import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { SkipTime } from '../../api';
import { StateSlice } from '../../utils/types';
import { PlayerState } from './types';

/**
 * Initial state.
 */
const initialPlayerState: PlayerState = {
  skipTimes: [],
  isSubmitMenuVisible: false,
  isVoteMenuVisible: false,
};

/**
 * Selectors.
 */
export const selectSkipTimes: Selector<
  StateSlice<PlayerState, 'player'>,
  SkipTime[]
> = (state) => state.player.skipTimes;

export const selectIsVoteMenuVisible: Selector<
  StateSlice<PlayerState, 'player'>,
  boolean
> = (state) => state.player.isVoteMenuVisible;

export const selectIsSubmitMenuVisible: Selector<
  StateSlice<PlayerState, 'player'>,
  boolean
> = (state) => state.player.isSubmitMenuVisible;

/**
 * Slice definition.
 */
const playerStateSlice = createSlice({
  name: 'player',
  initialState: initialPlayerState,
  reducers: {
    skipTimeAdded: (state, action: PayloadAction<SkipTime>) => {
      state.skipTimes.push(action.payload);
    },
    voteMenuVisibilityUpdated: (state, action: PayloadAction<boolean>) => {
      state.isVoteMenuVisible = action.payload;
    },
    submitMenuVisibilityUpdated: (state, action: PayloadAction<boolean>) => {
      state.isSubmitMenuVisible = action.payload;
    },
    skipTimeRemoved: (state, action: PayloadAction<string>) => {
      for (let i = 0; i < state.skipTimes.length; i += 1) {
        const skipTime = state.skipTimes[i];

        if (skipTime.skipId === action.payload) {
          state.skipTimes.splice(i, 1);
          return;
        }
      }
    },
    skipTimesRemoved: (state) => {
      state.skipTimes = [];
    },
    previewSkipTimesRemoved: (state) => {
      state.skipTimes.forEach((skipTime, index) => {
        if (skipTime.skipType === 'preview') {
          state.skipTimes.splice(index, 1);
        }
      });
    },
    stateReset: () => initialPlayerState,
  },
});

export const {
  skipTimeAdded,
  submitMenuVisibilityUpdated,
  voteMenuVisibilityUpdated,
  previewSkipTimesRemoved,
  skipTimeRemoved,
  skipTimesRemoved,
  stateReset,
} = playerStateSlice.actions;
export default playerStateSlice.reducer;
