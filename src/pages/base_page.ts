import stringSimilarity from 'string-similarity';
import { browser } from 'webextension-polyfill-ts';

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
    const identifier = this.getIdentifier();

    this.malId = (await BasePage.getMalIdCached(identifier)) || 0;

    if (this.malId > 0) {
      return this.malId;
    }

    try {
      const malsyncHttpClient = new MalsyncHttpClient();
      const providerName = this.getProviderName();
      this.malId = await malsyncHttpClient.getMalId(providerName, identifier);
    } catch {
      // MALSync was not able to find the id
      const title = this.getTitle();
      this.malId = await BasePage.findClosestMalId(title);
    }

    // Cache MAL id
    const { malIdCache: updatedMalIdCache } = await browser.storage.local.get({
      malIdCache: {},
    });
    updatedMalIdCache[identifier] = this.malId;
    browser.storage.local.set({ malIdCache: updatedMalIdCache });

    return this.malId;
  }

  /**
   * Search MAL and find the closest MAL id to the identifier
   * @param titleVariant Title from the provider
   */
  static async findClosestMalId(title: string): Promise<number> {
    const anilistHttpClient = new AnilistHttpClient();
    const sanitisedTitle = title.replace(/\(.*\)/, '').trim();

    const searchResponse = await anilistHttpClient.search(sanitisedTitle);
    const {
      data: {
        Page: { media: searchResults },
      },
    } = searchResponse;

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

  /**
   * Returns a MAL id from the cache
   * @param identifier Provider anime identifier
   */
  static async getMalIdCached(identifier: string): Promise<number | undefined> {
    const { malIdCache } = await browser.storage.local.get({
      malIdCache: {},
    });

    return malIdCache[identifier];
  }
}

export default BasePage;
