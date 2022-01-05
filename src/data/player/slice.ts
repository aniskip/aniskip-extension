import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { PreviewSkipTime, SkipTime } from '../../api';
import { StateSlice } from '../../utils/types';
import { PlayerState, PreviewSkipTimeUpdatedPayload } from './types';

/**
 * Initial state.
 */
const initialPlayerState: PlayerState = {
  previewSkipTime: undefined,
  skipTimes: [],
  isSubmitMenuVisible: false,
  isVoteMenuVisible: false,
};

/**
 * Selectors.
 */
export const selectPreviewSkipTime: Selector<
  StateSlice<PlayerState, 'player'>,
  PreviewSkipTime | undefined
> = (state) => state.player.previewSkipTime;

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
    previewSkipTimeAdded: (state, action: PayloadAction<PreviewSkipTime>) => {
      state.previewSkipTime = action.payload;
    },
    previewSkipTimeRemoved: (state) => {
      state.previewSkipTime = undefined;
    },
    previewSkipTimeIntervalUpdated: (
      state,
      action: PayloadAction<PreviewSkipTimeUpdatedPayload>
    ) => {
      if (!state.previewSkipTime) {
        return;
      }

      state.previewSkipTime.interval[action.payload.intervalType] =
        action.payload.time;
    },
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
    stateReset: () => initialPlayerState,
  },
});

export const {
  previewSkipTimeAdded,
  previewSkipTimeRemoved,
  previewSkipTimeIntervalUpdated,
  skipTimeAdded,
  submitMenuVisibilityUpdated,
  voteMenuVisibilityUpdated,
  skipTimeRemoved,
  skipTimesRemoved,
  stateReset,
} = playerStateSlice.actions;
export default playerStateSlice.reducer;
