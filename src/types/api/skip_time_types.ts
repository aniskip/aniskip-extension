export type GetResponseTypeFromSkipTimes =
  | {
      found: false;
    }
  | {
      found: true;
      result: {
        skip_times: {
          start_time: number;
          end_time: number;
        };
        skip_id: string;
        episode_length: number;
      };
    };

export interface SuccessMessageType {
  message: 'success';
}

export type PostResponseTypeFromSkipTimesVote = SuccessMessageType;
export type PostResponseTypeFromSkipTimes = SuccessMessageType;
