export type MediaTitle = {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
};

export type MediaCoverImage = {
  extraLarge: string;
  large: string;
  medium: string;
  colour: string;
};

export const MEDIA_FORMAT_NAMES = {
  TV: 'TV',
  TV_SHORT: 'TV SHORT',
  MOVIE: 'MOVIE',
  SPECIAL: 'SPECIAL',
  OVA: 'OVA',
  ONA: 'ONA',
  MUSIC: 'MUSIC',
  MANGA: 'MANGA',
  NOVEL: 'NOVEL',
  ONE_SHOT: 'ONE SHOT',
} as const;

export type MediaFormat = keyof typeof MEDIA_FORMAT_NAMES;

export type Media<
  MT extends Partial<MediaTitle> | undefined = undefined,
  MCI extends Partial<MediaCoverImage> | undefined = undefined,
  MF extends MediaFormat | undefined = undefined
> = {
  idMal: number;
} & (MT extends undefined
  ? {}
  : {
      title: MT;
      synonyms: string[];
    }) &
  (MCI extends undefined
    ? {}
    : {
        coverImage: MCI;
      }) &
  (MF extends undefined
    ? {}
    : {
        format: MF;
        seasonYear: number;
      });

export type PostResponseFromPage<M extends Partial<Media>> = {
  data: {
    Page: {
      media: M[];
    };
  };
};

export type PostResponseFromMedia<M extends Partial<Media>> = {
  data: {
    Media: M;
  };
};
