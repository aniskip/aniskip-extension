import { MalsyncHttpClientErrorCode } from './malsync_http_client.types';

export class MalsyncHttpClientError extends Error {
  code: MalsyncHttpClientErrorCode;

  constructor(message: string, errorCode: MalsyncHttpClientErrorCode) {
    super(message);

    this.code = errorCode;
  }
}
