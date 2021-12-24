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
};

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
};

export type CacheEntry<T> = {
  expires: string;
  value: T;
};

export const DEFAULT_SYNC_OPTIONS: SyncOptions = {
  userId: uuidv4(),
  skipOptions: DEFAULT_SKIP_OPTIONS,
  skipTimeIndicatorColours: DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
};

export type SyncOptions = {
  userId: string;
  skipOptions: SkipOptions;
  skipTimeIndicatorColours: SkipTimeIndicatorColours;
};

export const DEFAULT_LOCAL_OPTIONS: LocalOptions = {
  malIdCache: {},
  rulesCache: {},
  skipTimesVoted: {},
};

export type LocalOptions = {
  malIdCache: Partial<Record<string, CacheEntry<number>>>;
  rulesCache: Partial<Record<string, CacheEntry<Rule[]>>>;
  skipTimesVoted: Partial<Record<string, VoteType>>;
};

export type MessageType = 'fetch' | 'get-episode-information';

export type Message = {
  type: MessageType;
  payload?: any;
  uuid?: string;
};
