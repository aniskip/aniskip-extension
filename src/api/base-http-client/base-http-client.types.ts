import { Options } from 'ky';

export type Response<D = any> = {
  data: D;
  status: number;
  ok: boolean;
};

export type HttpClient = {
  baseUrl: string;

  /**
   * Performs a request to an API.
   *
   * @param config Axios config.
   * @param isCallingBackgroundScript Proxy the HTTP request using the background script.
   */
  request<D = any>(
    config: Config,
    isCallingBackgroundScript?: boolean
  ): Promise<Response<D>>;
};

export type Config = Options & { route: string; params?: any };
