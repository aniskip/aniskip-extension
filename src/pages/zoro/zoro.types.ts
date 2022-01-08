export type ZoroSyncData = {
  page: 'episode' | 'anime';
  name: string;
  anime_id: string;
  mal_id: string;
  anilist_id: string;
  series_url: string;
  episode: number;
  selector_position?: string;
  next_episode_url?: string;
};
