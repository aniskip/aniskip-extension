export interface Response<T> {
  json: T;
  ok: boolean;
  status: number;
}

export interface HttpClient {
  baseUrl: string;

  /**
   * Performs a request to an API
   * @param route API route to request
   * @param method Method to request with
   * @param params Url search parameters to add
   * @param body The body of the request
   */
  request<T>(
    route: string,
    method: string,
    params: Record<string, string>,
    body: string
  ): Promise<Response<T>>;
}
