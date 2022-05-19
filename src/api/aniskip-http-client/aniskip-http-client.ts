import {
  GetResponseFromRules,
  GetResponseFromSkipTimes,
  PostResponseFromSkipTimes,
  PostResponseFromSkipTimesVote,
  SkipType,
  VoteType,
} from './aniskip-http-client.types';
import { BaseHttpClient, Response } from '../base-http-client';
import { AniskipHttpClientError } from './error';

export class AniskipHttpClient extends BaseHttpClient {
  constructor() {
    super(
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/v2'
        : 'https://api.aniskip.com/v2'
    );
  }

  /**
   * Retrieves a skip time for the specified anime episode.
   *
   * @param animeId MAL id to get the skip times of.
   * @param episodeNumber Episode number of the anime to get the skip times of.
   * @param type Type of skip times to get.
   * @param episodeLength Length of the episode for filtering.
   */
  async getSkipTimes(
    animeId: number,
    episodeNumber: number,
    types: SkipType[],
    episodeLength: number
  ): Promise<GetResponseFromSkipTimes> {
    const route = `/skip-times/${animeId}/${episodeNumber}`;
    const params = { types, episodeLength: episodeLength.toFixed(3) };
    const response = await this.request({
      route,
      method: 'GET',
      params,
    });

    return response.data;
  }

  /**
   * Gets anime episode number redirection rules.
   *
   * @param animeId MAL id to get the episode number rules of.
   */
  async getRules(animeId: number): Promise<GetResponseFromRules> {
    const route = `/relation-rules/${animeId}`;
    const response = await this.request({ route, method: 'GET' });

    if (response.ok) {
      return response.data;
    }

    throw this.getError(response);
  }

  /**
   * Creates a skip time for the specified anime episode.
   *
   * @param animeId MAL id to get the skip times of.
   * @param episodeNumber Episode number of the anime to get the skip times of.
   * @param skipType Type of skip times to get, either 'op' or 'ed'.
   * @param providerName Name of the provider.
   * @param startTime Start time of the skip.
   * @param endTime End time of the skip.
   * @param episodeLength Length of the episode.
   * @param submitterId UUID of the submitter.
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
  ): Promise<PostResponseFromSkipTimes> {
    const route = `/skip-times/${animeId}/${episodeNumber}`;
    const data = {
      skipType,
      providerName,
      startTime,
      endTime,
      episodeLength,
      submitterId,
    };

    const response = await this.request<PostResponseFromSkipTimes>({
      route,
      method: 'POST',
      json: data,
    });
    const json = response.data;

    if (response.ok) {
      return json;
    }

    throw this.getError(response);
  }

  /**
   * Vote on a skip time.
   *
   * @param skipId UUID of the skip time to vote on.
   * @param type Type of voting, either 'upvote' or 'downvote'.
   */
  async vote(
    skipId: string,
    type: VoteType
  ): Promise<PostResponseFromSkipTimesVote> {
    const route = `/skip-times/vote/${skipId}`;
    const data = {
      voteType: type,
    };

    const response = await this.request({ route, method: 'POST', json: data });

    if (response.status === 429) {
      throw new AniskipHttpClientError('Rate limited', 'vote/rate-limited');
    }

    return response.data;
  }

  /**
   * Upvote on a skip time.
   *
   * @param skipId UUID of the skip time to vote on.
   */
  async upvote(skipId: string): Promise<PostResponseFromSkipTimesVote> {
    return this.vote(skipId, 'upvote');
  }

  /**
   * Downvote on a skip time.
   *
   * @param skipId UUID of the skip time to vote on.
   */
  async downvote(skipId: string): Promise<PostResponseFromSkipTimesVote> {
    return this.vote(skipId, 'downvote');
  }

  /**
   * Returns an appropriate error when the response is not ok.
   *
   * @param response Response of the HTTP request.
   */
  getError(response: Response): AniskipHttpClientError {
    switch (response.status) {
      case 429:
        return new AniskipHttpClientError(
          response.data.message,
          'skip-times/rate-limited'
        );
      case 400:
        return new AniskipHttpClientError(
          response.data.message,
          'skip-times/parameter-error'
        );
      case 500:
      default:
        return new AniskipHttpClientError(
          'Internal Server Error',
          'skip-times/internal-server-error'
        );
    }
  }
}
