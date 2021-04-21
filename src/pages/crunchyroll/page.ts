import { browser } from 'webextension-polyfill-ts';
import AnilistHttpClient from '../../api/anilist_http_client';
import BasePage from '../base_page';

class Crunchyroll extends BasePage {
  getIdentifier(): string {
    const titleElement = this.document
      .querySelector('[property="og:title"]')
      ?.getAttribute('content');

    if (!titleElement) {
      return '';
    }

    const encoded = encodeURIComponent(titleElement.toLocaleLowerCase());
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
    const {
      data: { Media: animeDetails },
    } = await anilistHttpClient.getRelations(malId);

    const [prequelEdge] = animeDetails.relations.edges.filter((edge) => {
      const { relationType, node } = edge;
      return relationType === 'PREQUEL' && node.format === 'TV';
    });

    if (prequelEdge) {
      const { node: prequelNode } = prequelEdge;
      const episodeNumberOffset = await Crunchyroll.getSeasonalEpisodeNumberHelper(
        anilistHttpClient,
        prequelNode.idMal
      );

      // The episode number is already in seasonal form
      if (episodeNumberOffset > episodeNumber) {
        return episodeNumber;
      }

      let seasonalEpisodeNumber = episodeNumber - episodeNumberOffset;

      // Handle season with parts
      if (seasonalEpisodeNumber > animeDetails.episodes) {
        const [sequel] = animeDetails.relations.edges.filter((edge) => {
          const { relationType, node } = edge;
          return relationType === 'SEQUEL' && node.format === 'TV';
        });
        this.malId = sequel.node.idMal;
        seasonalEpisodeNumber -= animeDetails.episodes;
      }

      return seasonalEpisodeNumber;
    }
    return episodeNumber;
  }

  /**
   * Returns the offset to subtract from the episode number
   * @param anilistHttpClient Jikan http client object
   * @param prequelMalId Prequel MAL identification number
   */
  static async getSeasonalEpisodeNumberHelper(
    anilistHttpClient: AnilistHttpClient,
    prequelMalId: number
  ): Promise<number> {
    const { episodeOffsetCache } = await browser.storage.local.get({
      episodeOffsetCache: {},
    });

    if (episodeOffsetCache[prequelMalId]) {
      return episodeOffsetCache[prequelMalId];
    }

    const {
      data: { Media: animeDetails },
    } = await anilistHttpClient.getRelations(prequelMalId);

    const [prequelEdge] = animeDetails.relations.edges.filter((edge) => {
      const { relationType, node } = edge;
      return relationType === 'PREQUEL' && node.format === 'TV';
    });

    let episodeOffset = animeDetails.episodes;

    if (prequelEdge) {
      const { node: prequelNode } = prequelEdge;
      episodeOffset =
        animeDetails.episodes +
        (await Crunchyroll.getSeasonalEpisodeNumberHelper(
          anilistHttpClient,
          prequelNode.idMal
        ));
    }

    // cache offset
    const {
      episodeOffsetCache: updatedEpisodeOffsetCache,
    } = await browser.storage.local.get({
      episodeOffsetCache: {},
    });
    updatedEpisodeOffsetCache[prequelMalId] = episodeOffset;
    browser.storage.local.set({
      episodeOffsetCache: updatedEpisodeOffsetCache,
    });

    return episodeOffset;
  }
}

export default Crunchyroll;
