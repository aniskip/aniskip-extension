import {
  SkipTimeIndicatorColours,
  SkipOptions,
  SkipOptionType,
} from '../../scripts/background';

export type SettingsState = {
  skipOptions: SkipOptions;
  skipTimeIndicatorColours: SkipTimeIndicatorColours;
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
