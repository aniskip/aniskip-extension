import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import {
  SetKeybind,
  SetSkipOption,
  SetSkipTimeIndicatorColour,
  SettingsState,
} from './types';
import {
  DEFAULT_KEYBINDS,
  DEFAULT_SKIP_OPTIONS,
  DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
  Keybinds,
  SkipOptions,
  SkipTimeIndicatorColours,
} from '../../scripts/background';
import { StateSlice } from '../../utils';

/**
 * Initial state.
 */
const initialSettingsState: SettingsState = {
  skipOptions: DEFAULT_SKIP_OPTIONS,
  skipTimeIndicatorColours: DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
  keybinds: DEFAULT_KEYBINDS,
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

export const selectKeybinds: Selector<
  StateSlice<SettingsState, 'settings'>,
  Keybinds
> = (state) => state.settings.keybinds;

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
    setKeybind: (state, action: PayloadAction<SetKeybind>) => {
      state.keybinds[action.payload.type] = action.payload.keybind;
    },
    setKeybinds: (state, action: PayloadAction<Keybinds>) => {
      state.keybinds = action.payload;
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
  setKeybind,
  setKeybinds,
  setIsSettingsLoaded,
} = settingsStateSlice.actions;
export default settingsStateSlice.reducer;
