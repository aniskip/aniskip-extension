import stringSimilarity from 'string-similarity';
import { browser } from 'webextension-polyfill-ts';
import {
  AniskipHttpClient,
  MalsyncHttpClient,
  AnilistHttpClient,
  Rule,
} from '../api';
import { Metadata, Page } from './base-page.types';
import {
  capitalizeFirstLetter,
  getDomainName,
  getNextWeekDate,
} from '../utils';
import { LocalOptions } from '../scripts/background';

export abstract class BasePage implements Page {
  hostname: string;

  pathname: string;

  document: Document;

  providerName: string;

  malId: number;

  episodeNumber: number;

  constructor(hostname: string, pathname: string, document: Document) {
    this.hostname = hostname;
    this.pathname = pathname;
    this.document = document;
    const domainName = getDomainName(this.hostname);
    this.providerName = capitalizeFirstLetter(domainName);
    this.malId = 0;
    this.episodeNumber = 0;
  }

  abstract getIdentifier(): string;

  abstract getRawEpisodeNumber(): number;

  async applyRules(): Promise<void> {
    const aniskipHttpClient = new AniskipHttpClient();
    const malId = await this.getMalId();
    let rules = await BasePage.getCachedRules(malId);

    if (!rules) {
      ({ rules } = await aniskipHttpClient.getRules(malId));

      // Cache rules and expire it next week.
      const { rulesCache } = (await browser.storage.local.get(
        'rulesCache'
      )) as LocalOptions;

      rulesCache[malId] = {
        expires: getNextWeekDate().toJSON(),
        value: rules,
      };

      browser.storage.local.set({ rulesCache });
    }

    let rawEpisodeNumber = this.getRawEpisodeNumber();
    this.episodeNumber = rawEpisodeNumber;

    rules.forEach((rule) => {
      const { start, end: endOrUndefined } = rule.from;
      const end = endOrUndefined ?? Infinity;
      const { malId: toMalId } = rule.to;

      // Handle seasons with multiple parts and continuous counting.
      if (malId === toMalId && rawEpisodeNumber > end) {
        const seasonLength = end - (start - 1);
        const episodeOverflow = rawEpisodeNumber - end;
        rawEpisodeNumber = episodeOverflow + seasonLength;
      }

      if (rawEpisodeNumber >= start && rawEpisodeNumber <= end) {
        this.malId = toMalId;
        this.episodeNumber = rawEpisodeNumber - (start - 1);
      }
    });
  }

  getEpisodeNumber(): number {
    return this.episodeNumber;
  }

  getTitle(): string {
    return this.getIdentifier();
  }

  getProviderName(): string {
    return this.providerName;
  }

  async getMalId(): Promise<number> {
    // Episode redirection rules applied.
    if (this.malId > 0) {
      return this.malId;
    }

    const identifier = this.getIdentifier();
    if (!identifier) {
      return 0;
    }

    this.malId = await BasePage.getCachedMalId(identifier);
    if (this.malId > 0) {
      return this.malId;
    }

    try {
      const providerName = this.getProviderName();
      const malsyncHttpClient = new MalsyncHttpClient();
      this.malId = await malsyncHttpClient.getMalId(providerName, identifier);
    } catch {
      // MALSync was not able to find the id.
      const title = this.getTitle();
      if (!title) {
        return 0;
      }
      this.malId = await BasePage.findClosestMalId(title);
    }

    // Cache MAL id and expire it next week.
    const { malIdCache } = (await browser.storage.local.get(
      'malIdCache'
    )) as LocalOptions;

    malIdCache[identifier] = {
      expires: getNextWeekDate().toJSON(),
      value: this.malId,
    };

    browser.storage.local.set({ malIdCache });

    return this.malId;
  }

  static getMetadata(): Metadata {
    throw new Error('getMetadata() not yet implemented');
  }

  /**
   * Search MAL and find the closest MAL id to the identifier.
   *
   * @param titleVariant Title from the provider.
   */
  static async findClosestMalId(title: string): Promise<number> {
    const anilistHttpClient = new AnilistHttpClient();
    const sanitisedTitle = title.replace(/\(.*\)/, '').trim();

    const searchResponse = await anilistHttpClient.search(sanitisedTitle);
    const searchResults = searchResponse.data.Page.media;

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
        if (similarity >= bestSimilarity) {
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
   * Returns a MAL id from the cache.
   *
   * @param identifier Provider anime identifier.
   */
  static async getCachedMalId(identifier: string): Promise<number> {
    const { malIdCache } = (await browser.storage.local.get(
      'malIdCache'
    )) as LocalOptions;

    const cacheEntry = malIdCache[identifier];

    if (
      !cacheEntry ||
      // Cache expired
      new Date().getTime() >= new Date(cacheEntry.expires).getTime()
    ) {
      return 0;
    }

    return cacheEntry.value;
  }

  /**
   * Returns the rules from the cache.
   *
   * @param malId MAL identification number.
   */
  static async getCachedRules(malId: number): Promise<Rule[] | undefined> {
    const { rulesCache } = (await browser.storage.local.get(
      'rulesCache'
    )) as LocalOptions;

    const cacheEntry = rulesCache[malId];

    if (
      !cacheEntry ||
      // Cache expired
      new Date().getTime() >= new Date(cacheEntry.expires).getTime()
    ) {
      return undefined;
    }

    return cacheEntry.value;
  }
}
