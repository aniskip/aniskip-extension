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

export type GetResponseTypeFromSkipTimes =
  | {
      found: false;
    }
  | {
      found: true;
      result: SkipTimeType;
    };

export interface SuccessMessageType {
  message: 'success';
}

export type PostResponseTypeFromSkipTimesVote = SuccessMessageType;
export type PostResponseTypeFromSkipTimes = SuccessMessageType;

export type VoteType = 'upvote' | 'downvote';
