/**
 * Parses the HTTP response according to its type.
 *
 * @param response HTTP response object.
 */
export const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.headers.get('content-type')?.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
};
