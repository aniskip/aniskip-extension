import {
  GetResponseTypeFromRules,
  GetResponseTypeFromSkipTimes,
  PostResponseTypeFromSkipTimes,
  PostResponseTypeFromSkipTimesVote,
  SkipType,
  VoteType,
} from '../../types/api/aniskip_types';
import BaseHttpClient from '../base_http_client';
import AniskipHttpClientError from './error';

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
    types: SkipType[]
  ): Promise<GetResponseTypeFromSkipTimes> {
    const route = `/skip-times/${animeId}/${episodeNumber}`;
    const params = { types };
    return this.request<GetResponseTypeFromSkipTimes>(route, 'GET', params);
  }

  /**
   * Gets anime episode number redirection rules
   * @param animeId MAL id to get the episode number rules of
   */
  async getRules(animeId: number): Promise<GetResponseTypeFromRules> {
    const route = `/rules/${animeId}`;
    return this.request<GetResponseTypeFromRules>(route, 'GET');
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
  ): Promise<PostResponseTypeFromSkipTimes> {
    const route = `/skip-times/${animeId}/${episodeNumber}`;
    const body = JSON.stringify({
      skip_type: skipType,
      provider_name: providerName,
      start_time: startTime,
      end_time: endTime,
      episode_length: episodeLength,
      submitter_id: submitterId,
    });

    const { message, error, status } = await this.request<
      PostResponseTypeFromSkipTimes & { status: number }
    >(route, 'POST', {}, body);

    if (error) {
      switch (status) {
        case 429:
          throw new AniskipHttpClientError(error, 'skip-times/rate-limited');
        case 400:
          throw new AniskipHttpClientError(error, 'skip-times/parameter-error');
        case 500:
        default:
          throw new AniskipHttpClientError(
            'Internal Server Error',
            'skip-times/internal-server-error'
          );
      }
    }

    return { message };
  }

  /**
   * Vote on a skip time
   * @param skipId UUID of the skip time to vote on
   * @param type Type of voting, either 'upvote' or 'downvote'
   */
  async vote(
    skipId: string,
    type: VoteType
  ): Promise<PostResponseTypeFromSkipTimesVote> {
    const route = `/skip-times/vote/${skipId}`;
    const body = JSON.stringify({
      vote_type: type,
    });
    const { message, status } = await this.request<
      PostResponseTypeFromSkipTimesVote & { status: number }
    >(route, 'POST', {}, body);
    if (status === 429) {
      throw new AniskipHttpClientError('Rate limited', 'vote/rate-limited');
    }
    return { message };
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
