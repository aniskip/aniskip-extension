import { SkipOptions, SkipOptionType } from '../../../scripts/background';

export type SettingsState = {
  skipOptions: SkipOptions;
};

export type SetSkipOption = {
  type: keyof SkipOptions;
  option: SkipOptionType;
};
