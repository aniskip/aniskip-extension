export type SkipType = 'op' | 'ed' | 'preview';

export type SkipTime = {
  interval: {
    start_time: number;
    end_time: number;
  };
  skip_type: SkipType;
  skip_id: string;
  episode_length: number;
};

export type GetResponseFromSkipTimes = {
  found: boolean;
  results: SkipTime[];
} & ResponseInformation;

export type Range = {
  start: number;
  end?: number;
};

export type Rule = {
  from: Range;
  to: { mal_id: number } & Range;
};

export type GetResponseFromRules = {
  found: boolean;
  rules: Rule[];
} & ResponseInformation;

export type ResponseInformation = {
  status_code: number;
  message: string;
};

export type ServerError = {
  error?: string;
};

export type PostResponseFromSkipTimesVote = ResponseInformation & ServerError;

export type PostResponseFromSkipTimes = {
  skip_id: string;
} & ResponseInformation &
  ServerError;

export type VoteType = 'upvote' | 'downvote';

export type AniskipHttpClientErrorCode =
  | 'vote/rate-limited'
  | 'skip-times/parameter-error'
  | 'skip-times/rate-limited'
  | 'skip-times/internal-server-error';
