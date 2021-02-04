interface HttpClient {
  baseUrl: string;
  request(
    route: string,
    method: string,
    params: Record<string, string>,
    body: string
  ): Promise<Response>;
}

export default HttpClient;
