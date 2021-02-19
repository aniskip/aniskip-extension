import { GetResponseTypeFromAnime } from '../types/api/jikan_types';
import BaseHttpClient from './base_http_client';

class JikanHttpClient extends BaseHttpClient {
  constructor() {
    super('https://api.jikan.moe/v3');
  }

  /**
   * Returns information about an anime from the given MAL id
   * @param malId MAL identification number
   */
  async getAnimeDetails(malId: number): Promise<GetResponseTypeFromAnime> {
    const route = `/anime/${malId}`;
    const response = await this.request(route, 'GET');
    return response.json();
  }
}

export default JikanHttpClient;
