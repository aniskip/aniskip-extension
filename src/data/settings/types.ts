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
