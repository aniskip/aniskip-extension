export const SKIP_TYPE_NAMES: Record<SkipType, string> = {
  op: 'Opening',
  ed: 'Ending',
  preview: 'Preview',
  'mixed-op': 'Mixed Opening',
  'mixed-ed': 'Mixed Ending',
  recap: 'Recap',
} as const;

export const SKIP_TYPES = [
  'op',
  'ed',
  'preview',
  'mixed-op',
  'mixed-ed',
  'recap',
] as const;

export type SkipType = typeof SKIP_TYPES[number];

export type SkipTime = {
  interval: {
    startTime: number;
    endTime: number;
  };
  skipType: SkipType;
  skipId: string;
  episodeLength: number;
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
  to: { malId: number } & Range;
};

export type GetResponseFromRules = {
  found: boolean;
  rules: Rule[];
} & ResponseInformation;

export type ResponseInformation = {
  statusCode: number;
  message: string;
};

export type ServerError = {
  error?: string;
};

export type PostResponseFromSkipTimesVote = ResponseInformation & ServerError;

export type PostResponseFromSkipTimes = {
  skipId: string;
} & ResponseInformation &
  ServerError;

export type VoteType = 'upvote' | 'downvote';

export type AniskipHttpClientErrorCode =
  | 'vote/rate-limited'
  | 'skip-times/parameter-error'
  | 'skip-times/rate-limited'
  | 'skip-times/internal-server-error';
