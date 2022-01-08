import {
  SkipTimeIndicatorColours,
  SkipOptions,
  SkipOptionType,
  KeybindType,
  SyncOptions,
} from '../../scripts/background';

export type SettingsState = {
  isUserEditingKeybind: Record<KeybindType, boolean>;
} & Omit<SyncOptions, 'userId'>;

export type SkipOptionUpdatedPayload = {
  type: keyof SkipOptions;
  option: SkipOptionType;
};

export type SkipTimeIndicatorColourUpdatedPayload = {
  type: keyof SkipTimeIndicatorColours;
  colour: string;
};

export type KeybindUpdatedPayload = {
  type: KeybindType;
  keybind: string;
};

export type IsUserEditingKeybindUpdatedPayload = {
  type: KeybindType;
  isUserEditingKeybind: boolean;
};
