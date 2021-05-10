import { useState } from 'react';
import AniskipHttpClient from '../api/aniskip_http_client';

const useAniskipHttpClient = () => {
  const [aniskipHttpClient] = useState(new AniskipHttpClient());

  return { aniskipHttpClient };
};

export default useAniskipHttpClient;
