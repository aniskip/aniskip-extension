import { SetOptional } from 'type-fest';
import { v4 as uuidv4 } from 'uuid';
import {
  Rule,
  SkipType,
  VoteType,
} from '../../api/aniskip-http-client/aniskip-http-client.types';
import { DEFAULT_COLOUR_PICKER_COLOURS } from '../../options/components/ColourPicker/ColourPicker.types';

export type SkipOptionType = 'disabled' | 'auto-skip' | 'manual-skip';

export type SkipOptions = SetOptional<
  {
    [T in SkipType]: SkipOptionType;
  },
  'preview'
>;

export const DEFAULT_SKIP_OPTIONS: SkipOptions = {
  op: 'manual-skip',
  ed: 'manual-skip',
  'mixed-ed': 'manual-skip',
  'mixed-op': 'manual-skip',
  recap: 'manual-skip',
} as const;

export type SkipTimeIndicatorColours = Omit<
  {
    [T in SkipType]: string;
  },
  'preview'
>;

export const DEFAULT_SKIP_TIME_INDICATOR_COLOURS: SkipTimeIndicatorColours = {
  op: DEFAULT_COLOUR_PICKER_COLOURS[5],
  ed: DEFAULT_COLOUR_PICKER_COLOURS[4],
  'mixed-op': DEFAULT_COLOUR_PICKER_COLOURS[3],
  'mixed-ed': DEFAULT_COLOUR_PICKER_COLOURS[2],
  recap: DEFAULT_COLOUR_PICKER_COLOURS[8],
} as const;

export const KEYBIND_TYPES = [
  'open-anime-search-overlay',
  'increase-current-time',
  'increase-current-time-large',
  'decrease-current-time',
  'decrease-current-time-large',
] as const;

export type KeybindType = typeof KEYBIND_TYPES[number];

export type Keybinds = {
  [T in KeybindType]: string;
};

export const DEFAULT_KEYBINDS: Keybinds = {
  'open-anime-search-overlay': 'Ctrl+Shift+F',
  'increase-current-time': 'l',
  'increase-current-time-large': 'Shift+L',
  'decrease-current-time': 'j',
  'decrease-current-time-large': 'Shift+J',
} as const;

export const KEYBIND_NAMES: Record<KeybindType, string> = {
  'open-anime-search-overlay': 'Open anime search overlay',
  'increase-current-time': 'Increase current time',
  'increase-current-time-large': 'Increase current time (large)',
  'decrease-current-time': 'Decrease current time',
  'decrease-current-time-large': 'Decrease current time (large)',
} as const;

export const KEYBIND_INFO: Record<KeybindType, string> = {
  'open-anime-search-overlay':
    'Used when auto-detection does not work or to manually override incorrect anime detection.',
  'increase-current-time': 'Increases the start time or end time by 0.1s.',
  'increase-current-time-large':
    'Increases the start time or end time by 0.25s.',
  'decrease-current-time': 'Decreases the start time or end time by 0.1s.',
  'decrease-current-time-large':
    'Decreases the start time or end time by 0.25s.',
} as const;

export type SyncOptions = {
  userId: string;
  skipOptions: SkipOptions;
  skipTimeIndicatorColours: SkipTimeIndicatorColours;
  keybinds: Keybinds;
};

export const DEFAULT_SYNC_OPTIONS: SyncOptions = {
  userId: uuidv4(),
  skipOptions: DEFAULT_SKIP_OPTIONS,
  skipTimeIndicatorColours: DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
  keybinds: DEFAULT_KEYBINDS,
};

export type CacheEntry<T> = {
  expires: string;
  value: T;
};

export type LocalOptions = {
  malIdCache: Partial<Record<string, CacheEntry<number>>>;
  rulesCache: Partial<Record<string, CacheEntry<Rule[]>>>;
  skipTimesVoted: Partial<Record<string, VoteType>>;
  manualTitleMalIdMap: Partial<Record<string, number>>;
};

export const DEFAULT_LOCAL_OPTIONS: LocalOptions = {
  malIdCache: {},
  rulesCache: {},
  skipTimesVoted: {},
  manualTitleMalIdMap: {},
};

export type MessageType =
  | 'fetch'
  | 'get-episode-information'
  | 'initialise-skip-times';

export type Message = {
  type: MessageType;
  payload?: any;
  uuid?: string;
};
