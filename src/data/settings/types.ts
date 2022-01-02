import {
  SkipTimeIndicatorColours,
  SkipOptions,
  SkipOptionType,
  KeybindType,
  SyncOptions,
} from '../../scripts/background';

export type SettingsState = {
  isUserEditingKeybind: Record<KeybindType, boolean>;
  isSettingsLoaded: boolean;
} & Omit<SyncOptions, 'userId'>;

export type SetSkipOption = {
  type: keyof SkipOptions;
  option: SkipOptionType;
};

export type SetSkipTimeIndicatorColour = {
  type: keyof SkipTimeIndicatorColours;
  colour: string;
};

export type SetKeybind = {
  type: KeybindType;
  keybind: string;
};

export type SetIsUserEditingKeybind = {
  type: KeybindType;
  isUserEditingKeybind: boolean;
};
