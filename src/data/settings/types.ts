import {
  SkipTimeIndicatorColours,
  SkipOptions,
  SkipOptionType,
  Keybinds,
  KeybindType,
} from '../../scripts/background';

export type SettingsState = {
  skipOptions: SkipOptions;
  skipTimeIndicatorColours: SkipTimeIndicatorColours;
  keybinds: Keybinds;
  isUserEditingKeybind: Record<KeybindType, boolean>;
  isSettingsLoaded: boolean;
};

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
