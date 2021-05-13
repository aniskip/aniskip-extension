export type SkipType = 'op' | 'ed';

export interface SkipTimeType {
  interval: {
    start_time: number;
    end_time: number;
  };
  skip_type: SkipType;
  skip_id: string;
  episode_length: number;
}

export type GetResponseTypeFromSkipTimes = {
  found: boolean;
  results: SkipTimeType[];
};

export interface SuccessMessageType {
  message: 'success';
}

export interface ServerErrorType {
  error?: string;
}

export type PostResponseTypeFromSkipTimesVote = SuccessMessageType &
  ServerErrorType;

export type PostResponseTypeFromSkipTimes = SuccessMessageType &
  ServerErrorType;

export type VoteType = 'upvote' | 'downvote';

export type HttpClientErrorCode =
  | 'vote/rate-limited'
  | 'skip-times/parameter-error';
