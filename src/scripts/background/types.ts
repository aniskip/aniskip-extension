import {
  Rule,
  VoteType,
} from '../../api/aniskip_http_client/aniskip_http_client.types';

export type SkipOptionType = 'disabled' | 'auto-skip' | 'manual-skip';

export type SkipOptions = {
  op: SkipOptionType;
  ed: SkipOptionType;
  preview?: SkipOptionType;
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
