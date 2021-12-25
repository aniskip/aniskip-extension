import { BaseHttpClient } from '../base-http-client';
import {
  Media,
  MediaCoverImage,
  MediaFormat,
  MediaTitle,
  PostResponseFromPage,
} from './anilist-http-client.types';

export class AnilistHttpClient extends BaseHttpClient {
  constructor() {
    super('https://graphql.anilist.co');
  }

  /**
   * Queries the graphql endpoint.
   *
   * @param query Query string for grapql api.
   * @param variables Variables used in query.
   */
  async query<T>(
    query: string,
    variables: Record<string, string | number>
  ): Promise<T> {
    const route = '/';
    const body = JSON.stringify({
      query,
      variables,
    });
    const response = await this.request(route, 'POST', undefined, body);

    return response.json<T>();
  }

  /**
   * Searches Anilist for title synonyms.
   *
   * @param type Specify what to search.
   * @param q Query to search.
   * @param limit search result limit.
   */
  async searchTitleSynonyms(
    title: string
  ): Promise<
    PostResponseFromPage<
      Pick<
        Media<Pick<MediaTitle, 'english' | 'romaji' | 'native'>>,
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

    return this.query<
      PostResponseFromPage<
        Media<Pick<MediaTitle, 'english' | 'romaji' | 'native'>>
      >
    >(query, variables);
  }

  /**
   * Searches Anilist title cover images.
   *
   * @param type Specify what to search.
   * @param q Query to search.
   * @param limit search result limit.
   */
  async searchTitleCoverImages(
    title: string
  ): Promise<
    PostResponseFromPage<
      Media<
        Pick<MediaTitle, 'english'>,
        Pick<MediaCoverImage, 'medium'>,
        MediaFormat
      >
    >
  > {
    const query = `
      query ($title: String) {
        Page {
          media (search: $title, type: ANIME) {
            idMal
            format
            seasonYear
            title {
              english
            }
            coverImage {
              medium
            }
          }
        }
      }
    `;
    const variables = {
      title,
    };

    return this.query<
      PostResponseFromPage<
        Media<
          Pick<MediaTitle, 'english'>,
          Pick<MediaCoverImage, 'medium'>,
          MediaFormat
        >
      >
    >(query, variables);
  }
}
