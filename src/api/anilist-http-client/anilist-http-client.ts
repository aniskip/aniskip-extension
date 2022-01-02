import { BaseHttpClient } from '../base-http-client';
import {
  Media,
  MediaCoverImage,
  MediaFormat,
  MediaTitle,
  PostResponseFromMedia,
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
    const data = {
      query,
      variables,
    };

    const response = await this.request(route, 'POST', data);

    return response.data;
  }

  /**
   * Searches Anilist for title synonyms.
   *
   * @param title Title to search for.
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
   * @param title Title to search for.
   */
  async searchTitleCoverImages(
    title: string
  ): Promise<
    PostResponseFromPage<
      Media<
        Omit<MediaTitle, 'userPreferred'>,
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
              romaji
              english
              native
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
          Omit<MediaTitle, 'userPreferred'>,
          Pick<MediaCoverImage, 'medium'>,
          MediaFormat
        >
      >
    >(query, variables);
  }

  /**
   * Searches Anilist for the cover image.
   *
   * @param malId MAL id of the cover image to search for.
   */
  async searchCoverImage(
    malId: number
  ): Promise<
    PostResponseFromMedia<
      Media<
        Omit<MediaTitle, 'userPreferred'>,
        Pick<MediaCoverImage, 'medium'>,
        MediaFormat
      >
    >
  > {
    const query = `
      query ($malId: Int) {
        Media (idMal: $malId, type: ANIME) {
          idMal
          title {
            romaji
            english
            native
          }
          coverImage {
            medium
          }
          format
          seasonYear
        }
      }
    `;

    const variables = {
      malId,
    };

    return this.query<
      PostResponseFromMedia<
        Media<
          Omit<MediaTitle, 'userPreferred'>,
          Pick<MediaCoverImage, 'medium'>,
          MediaFormat
        >
      >
    >(query, variables);
  }
}
