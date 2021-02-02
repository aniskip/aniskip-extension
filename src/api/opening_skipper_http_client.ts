import GetResponseTypeFromSkipTimes from '../types/api/skip_time_types';
import BaseHttpClient from './base_http_client';

class OpeningSkipperHttpClient extends BaseHttpClient {
  constructor() {
    super('http://localhost:5000/api/v1');
  }

  /**
   * Retrieves the skip times for the specified anime episode
   * @param animeId MAL id to get the skip times of
   * @param episodeNumber Episode number of the anime to get the skip times of
   * @param type Type of skip times to get, either 'op' or 'ed'
   */
  async getSkipTimes(
    animeId: number,
    episodeNumber: number,
    type: 'op' | 'ed'
  ): Promise<GetResponseTypeFromSkipTimes> {
    const route = `/skip-times/${animeId}/${episodeNumber}`;
    const params = { type };
    const response = await this.request(route, 'GET', params);
    return response.json();
  }
}

export default OpeningSkipperHttpClient;
