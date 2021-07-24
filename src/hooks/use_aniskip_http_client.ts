import { useState } from 'react';
import { AniskipHttpClient } from '../api';

/**
 * Hook to return Aniskip HTTP client.
 */
export const useAniskipHttpClient = (): {
  aniskipHttpClient: AniskipHttpClient;
} => {
  const [aniskipHttpClient] = useState(new AniskipHttpClient());

  return { aniskipHttpClient };
};
