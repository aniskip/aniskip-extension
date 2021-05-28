export type SkipType = 'op' | 'ed' | 'preview';

export interface SkipTimeType {
  interval: {
    start_time: number;
    end_time: number;
  };
  skip_type: SkipType;
  skip_id: string;
  episode_length: number;
}

export interface GetResponseTypeFromSkipTimes {
  found: boolean;
  results: SkipTimeType[];
}

export interface RangeType {
  start: number;
  end?: number;
}

export interface RuleType {
  from: RangeType;
  to: { malId: number } & RangeType;
}

export interface GetResponseTypeFromRules {
  found: boolean;
  rules: RuleType[];
}

export interface SuccessMessageType {
  message: 'success';
}

export interface ServerErrorType {
  error?: string;
}

export type PostResponseTypeFromSkipTimesVote = SuccessMessageType &
  ServerErrorType;

export type PostResponseTypeFromSkipTimes = {
  skip_id: string;
} & SuccessMessageType &
  ServerErrorType;

export type VoteType = 'upvote' | 'downvote';

export type AniskipHttpClientErrorCode =
  | 'vote/rate-limited'
  | 'skip-times/parameter-error'
  | 'skip-times/rate-limited'
  | 'skip-times/internal-server-error';
