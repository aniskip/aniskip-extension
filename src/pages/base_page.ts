import stringSimilarity from 'string-similarity';
import AnilistHttpClient from '../api/anilist_http_client';
import MalsyncHttpClient from '../api/malsync_http_client';
import Page from '../types/pages/page_type';
import { capitalizeFirstLetter } from '../utils/string_utils';

abstract class BasePage implements Page {
  hostname: string;

  pathname: string;

  document: Document;

  providerName: string;

  malId: number;

  constructor(hostname: string, pathname: string, document: Document) {
    this.hostname = hostname;
    this.pathname = pathname;
    this.document = document;
    const domainName = this.hostname.replace(
      /(?:[^.\n]*\.)?([^.\n]*)(\..*)/,
      '$1'
    );
    this.providerName = capitalizeFirstLetter(domainName);
    this.malId = 0;
  }

  abstract getIdentifier(): string;

  abstract getEpisodeNumber(): Promise<number>;

  getTitle(): string {
    return this.getIdentifier();
  }

  getProviderName(): string {
    return this.providerName;
  }

  async getMalId(): Promise<number> {
    if (this.malId > 0) {
      return this.malId;
    }

    const identifier = this.getIdentifier();

    try {
      const malsyncHttpClient = new MalsyncHttpClient();
      const providerName = this.getProviderName();
      this.malId = await malsyncHttpClient.getMalId(providerName, identifier);
    } catch {
      // MALSync was not able to find the id
      const title = this.getTitle();
      this.malId = await BasePage.findClosestMalId(title);
    }

    return this.malId;
  }

  /**
   * Search MAL and find the closest MAL id to the identifier
   * @param titleVariant Title from the provider
   */
  static async findClosestMalId(title: string): Promise<number> {
    const anilistHttpClient = new AnilistHttpClient();

    const searchResponse = await anilistHttpClient.search(title);
    const {
      data: {
        Page: { media: searchResults },
      },
    } = searchResponse;
    console.log({ title, searchResponse, searchResults });

    let closest = 0;
    let bestSimilarity = 0;
    searchResults.forEach(({ title: titleVariants, idMal, synonyms }) => {
      const titles = [...synonyms];
      Object.values(titleVariants).forEach((titleVariant) => {
        if (titleVariant) {
          titles.push(titleVariant);
        }
      });
      titles.forEach((titleVariant) => {
        const similarity = stringSimilarity.compareTwoStrings(
          titleVariant.toLocaleLowerCase(),
          title.toLocaleLowerCase()
        );
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          closest = idMal;
        }
      });
    });

    if (bestSimilarity > 0.6) {
      return closest;
    }

    throw new Error('Closest MAL id not found');
  }
}

export default BasePage;
