import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import {
  SetIsUserEditingKeybind,
  SetKeybind,
  SetSkipOption,
  SetSkipTimeIndicatorColour,
  SettingsState,
} from './types';
import {
  DEFAULT_KEYBINDS,
  DEFAULT_SKIP_OPTIONS,
  DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
  DEFAULT_SYNC_OPTIONS,
  Keybinds,
  KeybindType,
  KEYBIND_TYPES,
  SkipOptions,
  SkipTimeIndicatorColours,
  AnimeTitleLanguageType,
} from '../../scripts/background';
import { StateSlice } from '../../utils/types';

/**
 * Initial state.
 */
const initialSettingsState: SettingsState = {
  skipOptions: DEFAULT_SKIP_OPTIONS,
  skipTimeIndicatorColours: DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
  keybinds: DEFAULT_KEYBINDS,
  skipTimeLength: DEFAULT_SYNC_OPTIONS.skipTimeLength,
  changeCurrentTimeLength: DEFAULT_SYNC_OPTIONS.changeCurrentTimeLength,
  changeCurrentTimeLargeLength:
    DEFAULT_SYNC_OPTIONS.changeCurrentTimeLargeLength,
  animeTitleLanguage: DEFAULT_SYNC_OPTIONS.animeTitleLanguage,
  isChangelogNotificationVisible:
    DEFAULT_SYNC_OPTIONS.isChangelogNotificationVisible,
  isUserEditingKeybind: Object.assign(
    {},
    ...KEYBIND_TYPES.map((type) => ({ [type]: false }))
  ),
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

export const selectKeybinds: Selector<
  StateSlice<SettingsState, 'settings'>,
  Keybinds
> = (state) => state.settings.keybinds;

export const selectIsUserEditingKeybind: Selector<
  StateSlice<SettingsState, 'settings'>,
  Record<KeybindType, boolean>
> = (state) => state.settings.isUserEditingKeybind;

export const selectSkipTimeLength: Selector<
  StateSlice<SettingsState, 'settings'>,
  number
> = (state) => state.settings.skipTimeLength;

export const selectChangeCurrentTimeLength: Selector<
  StateSlice<SettingsState, 'settings'>,
  number
> = (state) => state.settings.changeCurrentTimeLength;

export const selectChangeCurrentTimeLargeLength: Selector<
  StateSlice<SettingsState, 'settings'>,
  number
> = (state) => state.settings.changeCurrentTimeLargeLength;

export const selectAnimeTitleLanguage: Selector<
  StateSlice<SettingsState, 'settings'>,
  AnimeTitleLanguageType
> = (state) => state.settings.animeTitleLanguage;

export const selectIsChangelogNotificationVisible: Selector<
  StateSlice<SettingsState, 'settings'>,
  boolean
> = (state) => state.settings.isChangelogNotificationVisible;

/**
 * Slice definition.
 */
const settingsStateSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    skipOptionUpdated: (state, action: PayloadAction<SetSkipOption>) => {
      state.skipOptions[action.payload.type] = action.payload.option;
    },
    skipOptionsUpdated: (state, action: PayloadAction<SkipOptions>) => {
      state.skipOptions = action.payload;
    },
    skipTimeIndicatorColourUpdated: (
      state,
      action: PayloadAction<SetSkipTimeIndicatorColour>
    ) => {
      state.skipTimeIndicatorColours[action.payload.type] =
        action.payload.colour;
    },
    skipTimeIndicatorColoursUpdated: (
      state,
      action: PayloadAction<SkipTimeIndicatorColours>
    ) => {
      state.skipTimeIndicatorColours = action.payload;
    },
    keybindUpdated: (state, action: PayloadAction<SetKeybind>) => {
      state.keybinds[action.payload.type] = action.payload.keybind;
    },
    keybindsUpdated: (state, action: PayloadAction<Keybinds>) => {
      state.keybinds = action.payload;
    },
    skipTimeLengthUpdated: (state, action: PayloadAction<number>) => {
      state.skipTimeLength = action.payload;
    },
    changeCurrentTimeLengthUpdated: (state, action: PayloadAction<number>) => {
      state.changeCurrentTimeLength = action.payload;
    },
    changeCurrentTimeLargeLengthUpdated: (
      state,
      action: PayloadAction<number>
    ) => {
      state.changeCurrentTimeLargeLength = action.payload;
    },
    animeTitleLanguageUpdated: (
      state,
      action: PayloadAction<AnimeTitleLanguageType>
    ) => {
      state.animeTitleLanguage = action.payload;
    },
    isUserEditingKeybindUpdated: (
      state,
      action: PayloadAction<SetIsUserEditingKeybind>
    ) => {
      state.isUserEditingKeybind[action.payload.type] =
        action.payload.isUserEditingKeybind;
    },
    changelogNotificationUpdated: (state, action: PayloadAction<boolean>) => {
      state.isChangelogNotificationVisible = action.payload;
    },
    changelogNotificationDismissed: (state) => {
      state.isChangelogNotificationVisible = false;
    },
  },
});

export const {
  skipOptionUpdated,
  skipOptionsUpdated,
  skipTimeIndicatorColourUpdated,
  skipTimeIndicatorColoursUpdated,
  keybindUpdated,
  keybindsUpdated,
  skipTimeLengthUpdated,
  changeCurrentTimeLengthUpdated,
  changeCurrentTimeLargeLengthUpdated,
  animeTitleLanguageUpdated,
  isUserEditingKeybindUpdated,
  changelogNotificationUpdated,
  changelogNotificationDismissed,
} = settingsStateSlice.actions;
export default settingsStateSlice.reducer;
