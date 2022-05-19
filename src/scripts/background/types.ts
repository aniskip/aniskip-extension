import { v4 as uuidv4 } from 'uuid';
import { MediaTitle } from '../../api/anilist-http-client/anilist-http-client.types';
import {
  Rule,
  SkipType,
  VoteType,
} from '../../api/aniskip-http-client/aniskip-http-client.types';
import { DEFAULT_COLOUR_PICKER_COLOURS } from '../../options/components/ColourPicker';

export type SkipOptionType = 'disabled' | 'auto-skip' | 'manual-skip';

export type SkipOptions = {
  [T in SkipType]: SkipOptionType;
};

export const DEFAULT_SKIP_OPTIONS: SkipOptions = {
  op: 'manual-skip',
  ed: 'manual-skip',
  'mixed-ed': 'manual-skip',
  'mixed-op': 'manual-skip',
  recap: 'manual-skip',
} as const;

export type SkipTimeIndicatorColours = {
  [T in SkipType | 'preview']: string;
};

export const DEFAULT_SKIP_TIME_INDICATOR_COLOURS: SkipTimeIndicatorColours = {
  op: DEFAULT_COLOUR_PICKER_COLOURS[5],
  ed: DEFAULT_COLOUR_PICKER_COLOURS[4],
  'mixed-op': DEFAULT_COLOUR_PICKER_COLOURS[3],
  'mixed-ed': DEFAULT_COLOUR_PICKER_COLOURS[2],
  recap: DEFAULT_COLOUR_PICKER_COLOURS[8],
  preview: DEFAULT_COLOUR_PICKER_COLOURS[1],
} as const;

export const KEYBIND_TYPES = [
  'open-anime-search-overlay',
  'increase-current-time',
  'increase-current-time-large',
  'decrease-current-time',
  'decrease-current-time-large',
  'skip-forward',
  'skip-backward',
  'seek-forward-one-frame',
  'seek-backward-one-frame',
] as const;

export type KeybindType = typeof KEYBIND_TYPES[number];

export const ANIME_SEARCH_OVERLAY_KEYBIND_TYPES = [
  'open-anime-search-overlay',
] as const;

export const SUBMIT_MENU_KEYBIND_TYPES = [
  'increase-current-time',
  'increase-current-time-large',
  'decrease-current-time',
  'decrease-current-time-large',
] as const;

export const PLAYER_CONTROLS_KEYBIND_TYPES = [
  'skip-forward',
  'skip-backward',
  'seek-forward-one-frame',
  'seek-backward-one-frame',
] as const;

export type Keybinds = {
  [T in KeybindType]: string;
};

export const DEFAULT_KEYBINDS: Keybinds = {
  'open-anime-search-overlay': 'Ctrl+Shift+F',
  'increase-current-time': 'l',
  'increase-current-time-large': 'Shift+L',
  'decrease-current-time': 'j',
  'decrease-current-time-large': 'Shift+J',
  'skip-forward': 'Ctrl+Shift+ArrowRight',
  'skip-backward': 'Ctrl+Shift+ArrowLeft',
  'seek-forward-one-frame': '.',
  'seek-backward-one-frame': ',',
} as const;

export const KEYBIND_NAMES: Record<KeybindType, string> = {
  'open-anime-search-overlay': 'Open anime search overlay',
  'increase-current-time': 'Increase current time',
  'increase-current-time-large': 'Increase current time (large)',
  'decrease-current-time': 'Decrease current time',
  'decrease-current-time-large': 'Decrease current time (large)',
  'seek-forward-one-frame': 'Seek forward one frame',
  'seek-backward-one-frame': 'Seek backward one frame',
  'skip-forward': 'Seek forward',
  'skip-backward': 'Seek backward',
} as const;

export const KEYBIND_INFO: Record<KeybindType, string> = {
  'open-anime-search-overlay':
    'Used when auto-detection does not work or to manually override incorrect anime detection.',
  'increase-current-time':
    'Increases the start time or end time by %s frame(s).',
  'increase-current-time-large':
    'Increases the start time or end time by %s frame(s).',
  'decrease-current-time':
    'Decreases the start time or end time by %s frame(s).',
  'decrease-current-time-large':
    'Decreases the start time or end time by %s frame(s).',
  'seek-forward-one-frame': 'Increases the current time forward by one frame.',
  'seek-backward-one-frame': 'Decreases the current time forward by one frame.',
  'skip-forward': 'Increases the current time forward by %ss.',
  'skip-backward': 'Decreases the current time forward by %ss.',
} as const;

export type AnimeTitleLanguageType = Exclude<keyof MediaTitle, 'userPreferred'>;

export type SyncOptions = {
  userId: string;
  skipOptions: SkipOptions;
  skipTimeIndicatorColours: SkipTimeIndicatorColours;
  keybinds: Keybinds;
  skipTimeLength: number;
  changeCurrentTimeFrames: number;
  changeCurrentTimeFramesLarge: number;
  animeTitleLanguage: AnimeTitleLanguageType;
  isChangelogNotificationVisible: boolean;
  isPreviewButtonEmulatingAutoSkip: boolean;
};

export const DEFAULT_SYNC_OPTIONS: SyncOptions = {
  userId: uuidv4(),
  skipOptions: DEFAULT_SKIP_OPTIONS,
  skipTimeIndicatorColours: DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
  keybinds: DEFAULT_KEYBINDS,
  skipTimeLength: 90,
  changeCurrentTimeFrames: 5,
  changeCurrentTimeFramesLarge: 15,
  animeTitleLanguage: 'english',
  isChangelogNotificationVisible: false,
  isPreviewButtonEmulatingAutoSkip: true,
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
