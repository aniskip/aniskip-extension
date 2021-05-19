export interface Mal {
  id: number;
  type: string;
  title: string;
  url: string;
  image: string;
}

export interface GetResponseTypeFromPage {
  identifier: string;
  type: string;
  page: string;
  title: string;
  url: string;
  image: string;
  malId: number;
  Mal: Mal;
  malUrl: string;
  ttl: number;
}

export type MalsyncHttpClientErrorCode = 'page/not-found';
