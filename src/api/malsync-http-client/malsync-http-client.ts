import { GetResponseFromPage } from './malsync-http-client.types';
import { MalsyncHttpClientError } from './error';
import { BaseHttpClient } from '../base-http-client';

export class MalsyncHttpClient extends BaseHttpClient {
  constructor() {
    super('https://api.malsync.moe');
  }

  /**
   * Retrieves the MAL details from a provider and identifier.
   *
   * @param providerName Name of provider.
   * @param identifier Provider anime identifier.
   */
  async getMalPageDetails(
    providerName: string,
    identifier: string
  ): Promise<GetResponseFromPage> {
    const route = `/page/${providerName}/${identifier}`;
    const response = await this.request({ route, method: 'GET' });

    if (response.ok) {
      return response.data;
    }

    switch (response.status) {
      case 422:
        throw new MalsyncHttpClientError(
          response.data.message,
          'page/validation-error'
        );
      case 429:
        throw new MalsyncHttpClientError(
          'Too many requests, please try again later',
          'page/rate-limited'
        );
      case 500:
      default:
        throw new MalsyncHttpClientError(
          response.data,
          'page/internal-server-error'
        );
    }
  }

  /**
   * Retrieves the MAL id from a provider and identifier.
   *
   * @param providerName Name of provider.
   * @param identifier Provider anime identifier.
   */
  async getMalId(providerName: string, identifier: string): Promise<number> {
    const pageDetails = await this.getMalPageDetails(providerName, identifier);

    return pageDetails.malId;
  }
}
