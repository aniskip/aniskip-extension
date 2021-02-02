import HttpClient from '../types/api/http_client_type';

class BaseHttpClient implements HttpClient {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Performs a request to an API
   * @param route API route to request
   * @param method Method to request with
   */
  async request(
    route: string,
    method: string,
    params: Record<string, string> = {},
    body: string = ''
  ): Promise<Response> {
    const url = new URL(`${this.baseUrl}${route}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    const options = {
      method,
      ...(method !== 'GET' && { body }),
    };
    return fetch(url.toString(), options);
  }
}

export default BaseHttpClient;
