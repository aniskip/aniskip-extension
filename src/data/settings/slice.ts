import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import {
  SettingsState,
  SetSkipOption,
  SetSkipTimeIndicatorColour,
} from './types';
import {
  DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
  DEFAULT_SKIP_OPTIONS,
  SkipTimeIndicatorColours,
  SkipOptions,
} from '../../scripts/background';
import { StateSlice } from '../../utils';

/**
 * Initial state.
 */
const initialSettingsState: SettingsState = {
  skipOptions: DEFAULT_SKIP_OPTIONS,
  skipTimeIndicatorColours: DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
  isSettingsLoaded: false,
};

/**
 * Selectors.
 */
export const selectSkipOptions: Selector<
  StateSlice<SettingsState, 'settings'>,
  SkipOptions
> = (state) => state.settings.skipOptions;

export const selectSkipTimeIndicatorColours: Selector<
  StateSlice<SettingsState, 'settings'>,
  SkipTimeIndicatorColours
> = (state) => state.settings.skipTimeIndicatorColours;

export const selectIsLoaded: Selector<
  StateSlice<SettingsState, 'settings'>,
  boolean
> = (state) => state.settings.isSettingsLoaded;

/**
 * Slice definition.
 */
const settingsStateSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    setSkipOption: (state, action: PayloadAction<SetSkipOption>) => {
      state.skipOptions[action.payload.type] = action.payload.option;
    },
    setSkipOptions: (state, action: PayloadAction<SkipOptions>) => {
      state.skipOptions = action.payload;
    },
    setSkipTimeIndicatorColour: (
      state,
      action: PayloadAction<SetSkipTimeIndicatorColour>
    ) => {
      state.skipTimeIndicatorColours[action.payload.type] =
        action.payload.colour;
    },
    setSkipTimeIndicatorColours: (
      state,
      action: PayloadAction<SkipTimeIndicatorColours>
    ) => {
      state.skipTimeIndicatorColours = action.payload;
    },
    setIsSettingsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isSettingsLoaded = action.payload;
    },
  },
});

export const {
  setSkipOption,
  setSkipOptions,
  setSkipTimeIndicatorColour,
  setSkipTimeIndicatorColours,
  setIsSettingsLoaded,
} = settingsStateSlice.actions;
export default settingsStateSlice.reducer;
