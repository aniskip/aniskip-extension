import { VoteType } from './api/aniskip_types';
import { SkipOptionType } from './skip_option_type';

export interface DefaultOptionsType {
  userId: string;
  opOption: SkipOptionType;
  edOption: SkipOptionType;
}

export interface LocalDefaultOptionsType {
  malIdCache: Record<string, number>;
  skipTimesVoted: Record<string, VoteType>;
}
