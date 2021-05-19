import { GetResponseTypeFromPage } from '../../types/api/malsync_types';
import BaseHttpClient from '../base_http_client';

class MalsyncHttpClient extends BaseHttpClient {
  constructor() {
    super('https://api.malsync.moe');
  }

  /**
   * Retrieves the MAL details from a provider and identifier
   * @param providerName Name of provider
   * @param identifier Provider anime identifier
   */
  async getMalPageDetails(
    providerName: string,
    identifier: string
  ): Promise<GetResponseTypeFromPage> {
    const route = `/page/${providerName}/${identifier}`;
    return this.request<GetResponseTypeFromPage>(route, 'GET');
  }

  /**
   * Retrieves the MAL id from a provider and identifier
   * @param providerName Name of provider
   * @param identifier Provider anime identifier
   */
  async getMalId(providerName: string, identifier: string): Promise<number> {
    const pageDetails = await this.getMalPageDetails(providerName, identifier);
    return pageDetails.malId;
  }
}

export default MalsyncHttpClient;
