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

export type MediaEdge<M extends Partial<Media> | undefined> = {
  node: M;
  relationType: MediaRelation;
};

export type MediaConnection<M extends Partial<Media> | undefined> = {
  edges: MediaEdge<M>[];
};

export type MediaTitle = {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
};

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

export type PostResponseFromMedia<M extends Partial<Media>> = {
  data: {
    Media: M;
  };
};

export type PostResponseFromPage<M extends Partial<Media>> = {
  data: {
    Page: {
      media: M[];
    };
  };
};
