import { useState } from 'react';

import { AniskipHttpClient } from '../api';

/**
 * Hook to return Aniskip HTTP client.
 */
const useAniskipHttpClient = (): { aniskipHttpClient: AniskipHttpClient } => {
  const [aniskipHttpClient] = useState(new AniskipHttpClient());

  return { aniskipHttpClient };
};

export default useAniskipHttpClient;
