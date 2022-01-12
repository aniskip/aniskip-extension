import { AxiosRequestConfig } from 'axios';

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
  request<T = any, D = any>(
    config: Config<T>,
    isCallingBackgroundScript?: boolean
  ): Promise<Response<D>>;
};

export type Config<T = any> = AxiosRequestConfig<T> & { route: string };
