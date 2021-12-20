import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { SkipTime } from '../../api';
import { StateSlice } from '../../utils/types';
import { PlayerState } from './types';

/**
 * Initial state.
 */
const initialPlayerState: PlayerState = {
  isReady: false,
  skipTimes: [],
  isSubmitMenuVisible: false,
  isVoteMenuVisible: false,
};

/**
 * Selectors.
 */
export const selectIsPlayerReady: Selector<
  StateSlice<PlayerState, 'player'>,
  boolean
> = (state) => state.player.isReady;

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
    addSkipTime: (state, action: PayloadAction<SkipTime>) => {
      state.skipTimes.push(action.payload);
    },
    changeVoteMenuVisibility: (state, action: PayloadAction<boolean>) => {
      state.isVoteMenuVisible = action.payload;
    },
    changeSubmitMenuVisibility: (state, action: PayloadAction<boolean>) => {
      state.isSubmitMenuVisible = action.payload;
    },
    readyPlayer: (state) => {
      state.isReady = true;
    },
    removeSkipTime: (state, action: PayloadAction<string>) => {
      for (let i = 0; i < state.skipTimes.length; i += 1) {
        const skipTime = state.skipTimes[i];

        if (skipTime.skipId === action.payload) {
          state.skipTimes.splice(i, 1);
          return;
        }
      }
    },
    removePreviewSkipTimes: (state) => {
      state.skipTimes.forEach((skipTime, index) => {
        if (skipTime.skipType === 'preview') {
          state.skipTimes.splice(index, 1);
        }
      });
    },
    reset: () => initialPlayerState,
  },
});

export const {
  addSkipTime,
  changeSubmitMenuVisibility,
  changeVoteMenuVisibility,
  readyPlayer,
  removePreviewSkipTimes,
  removeSkipTime,
  reset,
} = playerStateSlice.actions;
export default playerStateSlice.reducer;
