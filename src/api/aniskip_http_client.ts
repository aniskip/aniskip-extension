import {
  GetResponseTypeFromSkipTimes,
  PostResponseTypeFromSkipTimesVote,
  SkipType,
} from '../types/api/skip_time_types';
import BaseHttpClient from './base_http_client';

class AniskipHttpClient extends BaseHttpClient {
  constructor() {
    super(
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/v1'
        : 'https://api.aniskip.com/v1'
    );
  }

  /**
   * Retrieves a skip time for the specified anime episode
   * @param animeId MAL id to get the skip times of
   * @param episodeNumber Episode number of the anime to get the skip times of
   * @param type Type of skip times to get, either 'op' or 'ed'
   */
  async getSkipTimes(
    animeId: number,
    episodeNumber: number,
    type: SkipType
  ): Promise<GetResponseTypeFromSkipTimes> {
    const route = `/skip-times/${animeId}/${episodeNumber}`;
    const params = { type };
    const response = await this.request(route, 'GET', params);
    return response.json();
  }

  /**
   * Creates a skip time for the specified anime episode
   * @param animeId MAL id to get the skip times of
   * @param episodeNumber Episode number of the anime to get the skip times of
   * @param skipType Type of skip times to get, either 'op' or 'ed'
   * @param providerName Name of the provider
   * @param startTime Start time of the skip
   * @param endTime End time of the skip
   * @param episodeLength Length of the episode
   * @param submitterId UUID of the submitter
   */
  async createSkipTimes(
    animeId: number,
    episodeNumber: number,
    skipType: SkipType,
    providerName: string,
    startTime: number,
    endTime: number,
    episodeLength: number,
    submitterId: string
  ): Promise<GetResponseTypeFromSkipTimes> {
    const route = `/skip-times/${animeId}/${episodeNumber}`;
    const body = JSON.stringify({
      skip_type: skipType,
      provider_name: providerName,
      start_time: startTime,
      end_time: endTime,
      episode_length: episodeLength,
      submitter_id: submitterId,
    });
    const response = await this.request(route, 'POST', {}, body);
    return response.json();
  }

  /**
   * Vote on a skip time
   * @param skipId UUID of the skip time to vote on
   * @param type Type of voting, either 'upvote' or 'downvote'
   */
  async vote(
    skipId: string,
    type: 'upvote' | 'downvote'
  ): Promise<PostResponseTypeFromSkipTimesVote> {
    const route = `/skip-times/vote/${skipId}`;
    const body = JSON.stringify({
      type,
    });
    const response = await this.request(route, 'POST', {}, body);
    return response.json();
  }

  /**
   * Upvote on a skip time
   * @param skipId UUID of the skip time to vote on
   */
  async upvote(skipId: string): Promise<PostResponseTypeFromSkipTimesVote> {
    return this.vote(skipId, 'upvote');
  }

  /**
   * Downvote on a skip time
   * @param skipId UUID of the skip time to vote on
   */
  async downvote(skipId: string): Promise<PostResponseTypeFromSkipTimesVote> {
    return this.vote(skipId, 'downvote');
  }
}

export default AniskipHttpClient;
