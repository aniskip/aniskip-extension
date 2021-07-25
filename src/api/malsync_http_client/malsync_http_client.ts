import { GetResponseFromPage } from './malsync_http_client.types';
import { MalsyncHttpClientError } from './error';
import { BaseHttpClient } from '../base_http_client';

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
    const response = await this.request(route, 'GET');
    if (response.status === 400 && response.error) {
      throw new MalsyncHttpClientError(response.error, 'page/not-found');
    }

    return response.json<GetResponseFromPage>();
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
