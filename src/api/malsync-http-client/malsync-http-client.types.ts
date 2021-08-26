export type Mal = {
  id: number;
  type: string;
  title: string;
  url: string;
  image: string;
};

export type GetResponseFromPage = {
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
};

export type MalsyncHttpClientErrorCode = 'page/not-found' | 'page/rate-limited';
