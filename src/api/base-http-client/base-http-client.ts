import axios from 'axios';
import { browser } from 'webextension-polyfill-ts';
import { Response, HttpClient, Config } from './base-http-client.types';
import { Message } from '../../scripts/background';

export abstract class BaseHttpClient implements HttpClient {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T = any, D = any>(
    { route, ...rest }: Config<T>,
    isCallingBackgroundScript: boolean = true
  ): Promise<Response<D>> {
    const url = `${this.baseUrl}${route}`;

    if (isCallingBackgroundScript) {
      const response = await browser.runtime.sendMessage({
        type: 'fetch',
        payload: { url, ...rest },
      } as Message);

      return response;
    }

    let response;

    try {
      const succesfulResponse = await axios({ url, ...rest });

      response = {
        data: succesfulResponse.data,
        status: succesfulResponse.status,
        ok: true,
      };
    } catch (err: any) {
      response = {
        data: err.response.data,
        status: err.response.status,
        ok: false,
      };
    }

    return response;
  }
}
