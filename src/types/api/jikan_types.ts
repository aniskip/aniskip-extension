export interface From {
  day: number;
  month: number;
  year: number;
}

export interface To {
  day: number;
  month: number;
  year: number;
}

export interface Prop {
  from: From;
  to: To;
}

export interface Aired {
  from: Date;
  to: Date;
  prop: Prop;
  string: string;
}

export interface Adaptation {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface SideStory {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Summary {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Prequel {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Sequel {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Related {
  Adaptation?: Adaptation[];
  'Side story'?: SideStory[];
  Summary?: Summary[];
  Prequel?: Prequel[];
  Sequel?: Sequel[];
}

export interface Producer {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Licensor {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Studio {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface GetResponseTypeFromAnime {
  request_hash: string;
  request_cached: boolean;
  request_cache_expiry: number;
  mal_id: number;
  url: string;
  image_url: string;
  trailer_url: string;
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background?: any;
  premiered: string;
  broadcast: string;
  related: Related;
  producers: Producer[];
  licensors: Licensor[];
  studios: Studio[];
  genres: Genre[];
  opening_themes: string[];
  ending_themes: string[];
}
