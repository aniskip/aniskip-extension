import { VoteType } from '../../api';
import { SkipOptionsType } from '../../types/skip_option_type';

export type DefaultOptions = {
  userId: string;
  skipOptions: SkipOptionsType;
};

export type LocalDefaultOptions = {
  malIdCache: Record<string, number>;
  skipTimesVoted: Record<string, VoteType>;
};
