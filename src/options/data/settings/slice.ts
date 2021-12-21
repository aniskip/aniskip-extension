import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { SettingsState, SetSkipOption, SetSkipIndicatorColour } from './types';
import {
  DEFAULT_SKIP_INDICATOR_COLOURS,
  DEFAULT_SKIP_OPTIONS,
  SkipIndicatorColours,
  SkipOptions,
} from '../../../scripts/background';
import { StateSlice } from '../../../utils';

/**
 * Initial state.
 */
const initialSettingsState: SettingsState = {
  skipOptions: DEFAULT_SKIP_OPTIONS,
  skipIndicatorColours: DEFAULT_SKIP_INDICATOR_COLOURS,
  isSettingsLoaded: false,
};

/**
 * Selectors.
 */
export const selectSkipOptions: Selector<
  StateSlice<SettingsState, 'settings'>,
  SkipOptions
> = (state) => state.settings.skipOptions;

export const selectSkipIndicatorColours: Selector<
  StateSlice<SettingsState, 'settings'>,
  SkipIndicatorColours
> = (state) => state.settings.skipIndicatorColours;

export const selectIsLoaded: Selector<
  StateSlice<SettingsState, 'settings'>,
  boolean
> = (state) => state.settings.isSettingsLoaded;

/**
 * Slice definition.
 */
const settingsStateSlice = createSlice({
  name: 'player',
  initialState: initialSettingsState,
  reducers: {
    setSkipOption: (state, action: PayloadAction<SetSkipOption>) => {
      state.skipOptions[action.payload.type] = action.payload.option;
    },
    setSkipOptions: (state, action: PayloadAction<SkipOptions>) => {
      state.skipOptions = action.payload;
    },
    setSkipIndicatorColour: (
      state,
      action: PayloadAction<SetSkipIndicatorColour>
    ) => {
      state.skipIndicatorColours[action.payload.type] = action.payload.colour;
    },
    setSkipIndicatorColours: (
      state,
      action: PayloadAction<SkipIndicatorColours>
    ) => {
      state.skipIndicatorColours = action.payload;
    },
    setIsSettingsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isSettingsLoaded = action.payload;
    },
  },
});

export const {
  setSkipOption,
  setSkipOptions,
  setSkipIndicatorColour,
  setSkipIndicatorColours,
  setIsSettingsLoaded,
} = settingsStateSlice.actions;
export default settingsStateSlice.reducer;
