import { browser } from 'webextension-polyfill-ts';

import { Response, HttpClient } from '../types/api/http_client_type';
import { Message } from '../types/message_type';

abstract class BaseHttpClient implements HttpClient {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request(
    route: string,
    method: string,
    params: Record<string, string | string[]> = {},
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

    return { ...response, json: <T>() => JSON.parse(response.body) as T };
  }
}

export default BaseHttpClient;
