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
   * @param route API route to request.
   * @param method Method to request with.
   * @param data The body of the request.
   * @param params Url search parameters to add.
   */
  request<T>(
    route: string,
    method: string,
    data: T,
    params: Record<string, string>
  ): Promise<Response>;
};
