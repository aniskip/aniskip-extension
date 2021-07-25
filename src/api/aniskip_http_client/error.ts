import { AniskipHttpClientErrorCode } from './aniskip_http_client.types';

export class AniskipHttpClientError extends Error {
  code: AniskipHttpClientErrorCode;

  constructor(message: string, errorCode: AniskipHttpClientErrorCode) {
    super(message);

    this.code = errorCode;
  }
}
