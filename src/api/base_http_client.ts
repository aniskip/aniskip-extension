import { browser } from 'webextension-polyfill-ts';
import HttpClient from '../types/api/http_client_type';
import { Message } from '../types/message_type';
import waitForMessage from '../utils/message_utils';

abstract class BaseHttpClient implements HttpClient {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(
    route: string,
    method: string,
    params: Record<string, string | string[]> = {},
    body: string = ''
  ): Promise<T> {
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
    browser.runtime.sendMessage({
      type: 'fetch',
      payload: { url: url.toString(), options },
    } as Message);
    const response = (await waitForMessage('fetch-response')).payload;
    return response;
  }
}

export default BaseHttpClient;
