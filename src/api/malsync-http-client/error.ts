import { MalsyncHttpClientErrorCode } from './malsync-http-client.types';

export class MalsyncHttpClientError extends Error {
  code: MalsyncHttpClientErrorCode;

  constructor(message: string, errorCode: MalsyncHttpClientErrorCode) {
    super(message);

    this.code = errorCode;
  }
}
