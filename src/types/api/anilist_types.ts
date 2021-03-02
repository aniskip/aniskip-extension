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

export interface MediaEdge {
  node: Media;
  relationType: MediaRelation;
}

export interface MediaConnection {
  edges: MediaEdge[];
}

export interface Media {
  episodes: number;
  format?: MediaFormat;
  idMal: number;
  relations: MediaConnection;
}

export interface PostResponseTypeFromMedia {
  data: {
    Media: Media;
  };
}
