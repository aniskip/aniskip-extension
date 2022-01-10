import { AppConfig } from '.';
import { WindowProxy } from '../../utils';
import { BaseHttpClient, Config, Response } from '../base-http-client';
import {
  GetResponseFromIndexV2,
  GetResponseFromObjects,
  PostResponseFromAuthV1,
} from './crunchyroll-beta-http-client.types';

export class CrunchyrollBetaHttpClient extends BaseHttpClient {
  signature: string;

  keyPairId: string;

  bucket: string;

  policy: string;

  isAuthenticated: boolean;

  constructor() {
    super();

    this.signature = '';
    this.keyPairId = '';
    this.bucket = '';
    this.policy = '';
    this.isAuthenticated = false;
  }

  /**
   * Authenticates the http client.
   */
  async authenticate(): Promise<void> {
    if (this.isAuthenticated) {
      return;
    }

    const windowProxy = new WindowProxy();

    const appConfig = await windowProxy.getProperty<AppConfig>(
      '__APP_CONFIG__'
    );

    const { cxApiParams } = appConfig;

    this.baseUrl = cxApiParams.apiDomain;

    // V1 auth.
    let route = `/auth/v1/token`;

    const data = 'grant_type=etp_rt_cookie';

    let headers: Record<string, string> = {
      Authorization: `Basic ${btoa(`${cxApiParams.accountAuthClientId}:`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const authV1Response = await super.request<string, PostResponseFromAuthV1>(
      { route, method: 'POST', data, headers, withCredentials: true },
      false
    );

    // V2 auth.
    route = `/index/v2`;

    headers = {
      Authorization: `Bearer ${authV1Response.data.access_token}`,
    };

    const authV2Response = await super.request<
      undefined,
      GetResponseFromIndexV2
    >({ route, headers }, false);

    const { cms } = authV2Response.data;

    this.bucket = cms.bucket;
    this.signature = cms.signature;
    this.keyPairId = cms.key_pair_id;
    this.policy = cms.policy;
    this.isAuthenticated = true;
  }

  async request<T = any, D = any>({
    route,
    params,
    ...rest
  }: Config<T>): Promise<Response<D>> {
    await this.authenticate();

    const authenticatedRoute = `/cms/v2${this.bucket}${route}`;
    const authenticatedParams = {
      ...params,
      Signature: this.signature,
      'Key-Pair-Id': this.keyPairId,
      Policy: this.policy,
    };

    return super.request(
      {
        ...rest,
        route: authenticatedRoute,
        params: authenticatedParams,
      },
      false
    );
  }

  /**
   * Returns episode information.
   *
   * @param identifier Crunchyroll episode identifier.
   */
  async getEpisodeInformation(
    identifier: string
  ): Promise<GetResponseFromObjects> {
    const route = `/objects/${identifier}`;

    const response = await this.request({ route });

    return response.data;
  }
}
