import { HttpClientErrorCode } from '../../types/api/aniskip_types';

class AniskipHttpClientError extends Error {
  code: HttpClientErrorCode;

  constructor(message: string, errorCode: HttpClientErrorCode) {
    super(message);

    this.code = errorCode;
  }
}

export default AniskipHttpClientError;
