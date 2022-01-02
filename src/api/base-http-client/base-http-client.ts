import { browser } from 'webextension-polyfill-ts';
import { Response, HttpClient } from './base-http-client.types';
import { Message } from '../../scripts/background';

export abstract class BaseHttpClient implements HttpClient {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T = any, D = any>(
    route: string,
    method: string,
    data?: T,
    params?: Record<string, string | string[] | number>
  ): Promise<Response<D>> {
    const url = `${this.baseUrl}${route}`;

    const response = await browser.runtime.sendMessage({
      type: 'fetch',
      payload: { url: url.toString(), method, data, params },
    } as Message);

    return response;
  }
}
