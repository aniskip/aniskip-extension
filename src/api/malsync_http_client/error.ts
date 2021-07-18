import { MalsyncHttpClientErrorCode } from '../../types/api/malsync_types';

export class MalsyncHttpClientError extends Error {
  code: MalsyncHttpClientErrorCode;

  constructor(message: string, errorCode: MalsyncHttpClientErrorCode) {
    super(message);

    this.code = errorCode;
  }
}
