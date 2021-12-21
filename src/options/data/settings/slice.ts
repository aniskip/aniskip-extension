import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { SettingsState, SetSkipOption } from './types';
import { DEFAULT_SKIP_OPTIONS, SkipOptions } from '../../../scripts/background';
import { StateSlice } from '../../../utils';

/**
 * Initial state.
 */
const initialSettingsState: SettingsState = {
  skipOptions: DEFAULT_SKIP_OPTIONS,
};

/**
 * Selectors.
 */
export const selectSkipOptions: Selector<
  StateSlice<SettingsState, 'settings'>,
  SkipOptions
> = (state) => state.settings.skipOptions;

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
  },
});

export const { setSkipOption, setSkipOptions } = settingsStateSlice.actions;
export default settingsStateSlice.reducer;
