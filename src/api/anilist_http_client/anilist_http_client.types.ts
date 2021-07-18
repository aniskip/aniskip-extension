export type MediaRelation =
  | 'ADAPTATION'
  | 'PREQUEL'
  | 'SEQUEL'
  | 'PARENT'
  | 'SIDE_STORY'
  | 'CHARACTER'
  | 'SUMMARY'
  | 'ALTERNATIVE'
  | 'SPIN_OFF'
  | 'OTHER'
  | 'SOURCE'
  | 'COMPILATION'
  | 'CONTAINS';

export type MediaFormat =
  | 'TV'
  | 'TV_SHORT'
  | 'MOVIE'
  | 'SPECIAL'
  | 'OVA'
  | 'ONA'
  | 'MUSIC'
  | 'MANGA'
  | 'NOVEL'
  | 'ONE_SHOT';

export interface MediaEdge<M extends Partial<Media> | undefined> {
  node: M;
  relationType: MediaRelation;
}

export interface MediaConnection<M extends Partial<Media> | undefined> {
  edges: MediaEdge<M>[];
}

export interface MediaTitle {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
}

export type Media<
  M extends Partial<Media> | undefined = undefined,
  MT extends Partial<MediaTitle> | undefined = undefined
> = {
  episodes: number | null;
  format: MediaFormat;
  idMal: number;
  synonyms: string[];
} & (M extends undefined
  ? {}
  : {
      relations: MediaConnection<M>;
    }) &
  (MT extends undefined
    ? {}
    : {
        title: MT;
      });

export interface PostResponseFromMedia<M extends Partial<Media>> {
  data: {
    Media: M;
  };
}

export interface PostResponseFromPage<M extends Partial<Media>> {
  data: {
    Page: {
      media: M[];
    };
  };
}
