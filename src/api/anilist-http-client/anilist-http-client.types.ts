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

export type Media<
  MT extends Partial<MediaTitle> | undefined = undefined,
  MCI extends Partial<MediaCoverImage> | undefined = undefined
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
      });

export type PostResponseFromPage<M extends Partial<Media>> = {
  data: {
    Page: {
      media: M[];
    };
  };
};
