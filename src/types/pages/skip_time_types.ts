interface GetResponseTypeFromSkipTimes {
  found: boolean;
  result: {
    skip_times: {
      start_time: number;
      end_time: number;
    };
    skip_id: string;
    episode_length: number;
  };
}

export default GetResponseTypeFromSkipTimes;
