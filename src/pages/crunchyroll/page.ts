import { browser } from 'webextension-polyfill-ts';
import AnilistHttpClient from '../../api/anilist_http_client';
import BasePage from '../base_page';

class Crunchyroll extends BasePage {
  getIdentifier(): string {
    const title = this.getTitle();
    const encoded = encodeURIComponent(title.toLocaleLowerCase());
    const reEncoded = encodeURIComponent(encoded.replace(/\./g, '%2e'));
    return reEncoded;
  }

  async getEpisodeNumber(): Promise<number> {
    const matches = this.pathname.match(/episode-([0-9]+)/);
    if (matches) {
      const episodeNumber = parseInt(matches[1], 10);
      const malId = await this.getMalId();
      const anilistHttpClient = new AnilistHttpClient();
      const seasonalEpisodeNumber = await this.getSeasonalEpisodeNumber(
        anilistHttpClient,
        malId,
        episodeNumber
      );
      return seasonalEpisodeNumber;
    }
    return -1;
  }

  getTitle(): string {
    const title = this.document
      .querySelector('[name="title"]')
      ?.getAttribute('content')
      ?.split(' Episode')[0];

    return title || '';
  }

  /**
   * Converts the episode number into seasonal episode number form
   * @param anilistHttpClient Anilist http client object
   * @param malId MAL identification number
   * @param episodeNumber Extracted episode number
   */
  async getSeasonalEpisodeNumber(
    anilistHttpClient: AnilistHttpClient,
    malId: number,
    episodeNumber: number
  ): Promise<number> {
    const animeDetails = (await anilistHttpClient.getRelations(malId)).data
      .Media;

    const episodeNumberOffset =
      await Crunchyroll.getSeasonalEpisodeNumberHelper(
        anilistHttpClient,
        malId
      );

    // The episode number is already in seasonal form
    if (episodeNumberOffset >= episodeNumber) {
      return episodeNumber;
    }

    let seasonalEpisodeNumber = episodeNumber - episodeNumberOffset;

    // Handle season with parts
    if (
      animeDetails.episodes &&
      seasonalEpisodeNumber > animeDetails.episodes
    ) {
      const [sequel] = animeDetails.relations.edges.filter((edge) => {
        const { relationType, node } = edge;
        return relationType === 'SEQUEL' && node.format === 'TV';
      });
      this.malId = sequel.node.idMal;
      seasonalEpisodeNumber -= animeDetails.episodes;
    }

    return seasonalEpisodeNumber;
  }

  /**
   * Returns the offset to subtract from the episode number
   * @param anilistHttpClient Anilist http client object
   * @param malId MAL id of the target series
   * @param prequelMalId Prequel MAL identification number
   */
  static async getSeasonalEpisodeNumberHelper(
    anilistHttpClient: AnilistHttpClient,
    malId: number
  ): Promise<number> {
    const { episodeOffsetCache } = await browser.storage.local.get({
      episodeOffsetCache: {},
    });

    if (malId in episodeOffsetCache) {
      return episodeOffsetCache[malId];
    }

    const animeDetails = (await anilistHttpClient.getRelations(malId)).data
      .Media;

    const [prequelEdge] = animeDetails.relations.edges.filter((edge) => {
      const { relationType, node } = edge;
      return relationType === 'PREQUEL' && node.format === 'TV';
    });

    let episodeOffset = 0;

    if (prequelEdge) {
      const prequelNode = prequelEdge.node;
      episodeOffset =
        (prequelNode.episodes || 0) +
        (await Crunchyroll.getSeasonalEpisodeNumberHelper(
          anilistHttpClient,
          prequelNode.idMal
        ));
    }

    // Cache offset
    const updatedEpisodeOffsetCache = (
      await browser.storage.local.get({
        episodeOffsetCache: {},
      })
    ).episodeOffsetCache;
    updatedEpisodeOffsetCache[malId] = episodeOffset;

    browser.storage.local.set({
      episodeOffsetCache: updatedEpisodeOffsetCache,
    });

    return episodeOffset;
  }
}

export default Crunchyroll;
