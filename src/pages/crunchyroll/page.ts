import JikanHttpClient from '../../api/jikan_http_client';
import BasePage from '../base_page';

class Crunchyroll extends BasePage {
  getIdentifier(): string {
    const title = Array.from(
      this.document.getElementsByTagName('title')
    ).filter(
      (titleElement: HTMLTitleElement) => titleElement.text !== undefined
    )[0].text;
    const seriesNameWithEpisode = title.split(', ')[0];
    const seriesName = seriesNameWithEpisode.replace(/\sEpisode\s[0-9]+/, '');
    const encoded = encodeURIComponent(seriesName.toLocaleLowerCase());
    const reEncoded = encodeURIComponent(encoded.replace(/\./g, '%2e'));
    return reEncoded;
  }

  async getEpisodeNumber(): Promise<number> {
    const matches = this.pathname.match(/episode-([0-9]+)/);
    if (matches) {
      const episodeNumber = parseInt(matches[1], 10);
      const malId = await this.getMalId();
      const jikanHttpClient = new JikanHttpClient();
      const seasonalEpisodeNumber = await Crunchyroll.getSeasonalEpisodeNumber(
        jikanHttpClient,
        malId,
        episodeNumber
      );
      return seasonalEpisodeNumber;
    }
    return -1;
  }

  /**
   * Converts the episode number into seasonal episode number form
   * @param jikanHttpClient Jikan http client object
   * @param malId MAL identification number
   * @param episodeNumber Extracted episode number
   */
  static async getSeasonalEpisodeNumber(
    jikanHttpClient: JikanHttpClient,
    malId: number,
    episodeNumber: number
  ): Promise<number> {
    const animeDetails = await jikanHttpClient.getAnimeDetails(malId);
    if (animeDetails.related.Prequel) {
      const [prequel] = animeDetails.related.Prequel;
      const episodeNumberOffset = await Crunchyroll.getSeasonalEpisodeNumberHelper(
        jikanHttpClient,
        prequel.mal_id
      );

      // The episode number is already in seasonal form
      if (episodeNumberOffset > episodeNumber) {
        return episodeNumber;
      }

      let seasonalEpisodeNumber = episodeNumber - episodeNumberOffset;

      // Handle season with parts
      if (seasonalEpisodeNumber > animeDetails.episodes) {
        seasonalEpisodeNumber -= animeDetails.episodes;
      }

      return seasonalEpisodeNumber;
    }
    return episodeNumber;
  }

  /**
   * Returns the offset to subtract from the episode number
   * @param jikanHttpClient Jikan http client object
   * @param prequelMalId Prequel MAL identification number
   */
  static async getSeasonalEpisodeNumberHelper(
    jikanHttpClient: JikanHttpClient,
    prequelMalId: number
  ): Promise<number> {
    const animeDetails = await jikanHttpClient.getAnimeDetails(prequelMalId);

    const isTvEpisode = animeDetails.type === 'TV';

    if (animeDetails.related.Prequel) {
      const [prequel] = animeDetails.related.Prequel;
      if (!isTvEpisode) {
        return Crunchyroll.getSeasonalEpisodeNumberHelper(
          jikanHttpClient,
          prequel.mal_id
        );
      }

      return (
        animeDetails.episodes +
        (await Crunchyroll.getSeasonalEpisodeNumberHelper(
          jikanHttpClient,
          prequel.mal_id
        ))
      );
    }

    return !isTvEpisode ? 0 : animeDetails.episodes;
  }
}

export default Crunchyroll;
