import {
  SkipIndicatorColours,
  SkipOptions,
  SkipOptionType,
} from '../../../scripts/background';

export type SettingsState = {
  skipOptions: SkipOptions;
  skipIndicatorColours: SkipIndicatorColours;
};

export type SetSkipOption = {
  type: keyof SkipOptions;
  option: SkipOptionType;
};

export type SetSkipIndicatorColour = {
  type: keyof SkipIndicatorColours;
  colour: string;
};
