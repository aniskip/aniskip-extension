import BaseHttpClient from './base_http_client';
import {
  Media,
  MediaTitle,
  PostResponseTypeFromPage,
} from '../types/api/anilist_types';

class AnilistHttpClient extends BaseHttpClient {
  constructor() {
    super('https://graphql.anilist.co');
  }

  /**
   * Queries the graphql endpoint
   * @param query Query string for grapql api
   * @param variables Variables used in query
   */
  async query(
    query: string,
    variables: Record<string, string | number>
  ): Promise<Response> {
    const route = '/';
    const body = JSON.stringify({
      query,
      variables,
    });
    return this.request(route, 'POST', undefined, body);
  }

  /**
   * Searches Anilist
   * @param type Specify what to search
   * @param q Query to search
   * @param limit search result limit
   */
  async search(
    title: string
  ): Promise<
    PostResponseTypeFromPage<
      Pick<
        Media<undefined, Pick<MediaTitle, 'english' | 'romaji' | 'native'>>,
        'idMal' | 'title' | 'synonyms'
      >
    >
  > {
    const query = `
      query ($title: String) {
        Page {
          media (search: $title, type: ANIME) {
            idMal
            title {
              romaji
              english
              native
              userPreferred
            }
            synonyms
          }
        }
      }
    `;
    const variables = {
      title,
    };
    const response = await this.query(query, variables);
    return response.json();
  }
}

export default AnilistHttpClient;
