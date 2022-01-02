import { browser } from 'webextension-polyfill-ts';
import { Response, HttpClient } from './base-http-client.types';
import { Message } from '../../scripts/background';

export abstract class BaseHttpClient implements HttpClient {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request(
    route: string,
    method: string,
    params: Record<string, string | string[] | number> = {},
    body: string = ''
  ): Promise<Response> {
    const url = new URL(`${this.baseUrl}${route}`);
    Object.entries(params).forEach(([key, param]) => {
      if (Array.isArray(param)) {
        param.forEach((value) => {
          url.searchParams.append(key, value);
        });
        return;
      }

      if (typeof param === 'number') {
        url.searchParams.append(key, param.toFixed(3));

        return;
      }

      url.searchParams.append(key, param);
    });
    const options: RequestInit = {
      method,
    };

    if (method === 'POST' && body) {
      options.headers = {
        'Content-Type': 'application/json',
      };
      options.body = body;
    }

    const response = await browser.runtime.sendMessage({
      type: 'fetch',
      payload: { url: url.toString(), options },
    } as Message);

    return { ...response, json: <T>(): T => JSON.parse(response.body) as T };
  }
}
