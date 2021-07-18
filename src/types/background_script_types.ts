import { VoteType } from '../api';
import { SkipOptionsType } from './skip_option_type';

export interface DefaultOptionsType {
  userId: string;
  skipOptions: SkipOptionsType;
}

export interface LocalDefaultOptionsType {
  malIdCache: Record<string, number>;
  skipTimesVoted: Record<string, VoteType>;
}
