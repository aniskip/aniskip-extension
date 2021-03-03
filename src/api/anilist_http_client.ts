import BaseHttpClient from './base_http_client';
import {
  Media,
  MediaTitle,
  PostResponseTypeFromMedia,
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
   * Returns the relations an anime has
   * @param malId MAL id of anime to get relations of
   */
  async getRelations(
    malId: number
  ): Promise<
    PostResponseTypeFromMedia<
      Pick<
        Media<Pick<Media, 'episodes' | 'format' | 'idMal'>>,
        'episodes' | 'idMal' | 'relations'
      >
    >
  > {
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
    const variables = {
      malId,
    };
    const response = await this.query(query, variables);
    return response.json();
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
