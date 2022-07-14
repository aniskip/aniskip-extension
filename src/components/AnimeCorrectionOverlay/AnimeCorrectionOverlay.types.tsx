import { MediaFormat } from '../../api';

export type SearchResult = {
  malId: number;
  title: string;
  coverImage: string;
  seasonYear: number;
  format: MediaFormat;
};
