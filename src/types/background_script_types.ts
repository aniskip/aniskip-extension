import { VoteType } from './api/aniskip_types';
import { SkipOptionType } from './options/skip_option_type';

export interface DefaultOptionsType {
  userId: string;
  openingOption: SkipOptionType;
  endingOption: SkipOptionType;
}

export interface LocalDefaultOptionsType {
  episodeOffsetCache: Record<string, number>;
  malIdCache: Record<string, number>;
  skipTimesVoted: Record<string, VoteType>;
}
