import BaseHttpClient from './base_http_client';
import { PostResponseTypeFromMedia } from '../types/api/anilist_types';

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
   * Returns the relations an anime has
   * @param malId MAL id of anime to get relations of
   */
  async getRelations(malId: number): Promise<PostResponseTypeFromMedia> {
    const query = `
    query ($malId: Int) {
      Media (idMal: $malId, type: ANIME) {
        episodes
        idMal
        relations {
          edges {
            node {
              format
              episodes
              idMal
            }
            relationType
          }
        }
      }
    }
    `;
    const variables: Record<string, number> = {
      malId,
    };
    const response = await this.query(query, variables);
    return response.json();
  }
}

export default AnilistHttpClient;
