import { VoteType } from '../../api';

export type SkipOptionType = 'disabled' | 'auto-skip' | 'manual-skip';

export type SkipOptions = {
  op: SkipOptionType;
  ed: SkipOptionType;
};

export type DefaultOptions = {
  userId: string;
  skipOptions: SkipOptions;
};

export type LocalDefaultOptions = {
  malIdCache: Record<string, number>;
  skipTimesVoted: Record<string, VoteType>;
};

export type MessageType =
  | 'fetch'
  | 'get-episode-information'
  | 'player-add-preview-skip-time'
  | 'player-add-skip-time'
  | 'player-get-current-time'
  | 'player-get-duration'
  | 'player-play'
  | 'player-ready'
  | 'player-remove-skip-time'
  | 'player-set-current-time';

export type Message = {
  type: MessageType;
  payload?: any;
  uuid?: string;
};
