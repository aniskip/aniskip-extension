import { SetOptional } from 'type-fest';
import {
  Rule,
  SkipType,
  VoteType,
} from '../../api/aniskip-http-client/aniskip-http-client.types';

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

export type CacheEntry<T> = {
  expires: string;
  value: T;
};

export type SyncOptions = {
  userId: string;
  skipOptions: SkipOptions;
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
