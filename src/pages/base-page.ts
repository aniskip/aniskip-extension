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
import { OverlayRenderer } from '../renderers';
import {
  Store,
  configureStore,
  malIdUpdated,
  overlayOpened,
  selectMalId,
} from '../data';

export abstract class BasePage implements Page {
  providerName: string;

  episodeNumber: number;

  store: Store;

  overlayRenderer: OverlayRenderer;

  constructor() {
    const domainName = getDomainName(window.location.hostname);
    this.providerName = capitalizeFirstLetter(domainName);
    this.episodeNumber = 0;
    this.store = configureStore('aniskip-page');
    this.overlayRenderer = new OverlayRenderer(
      'aniskip-overay',
      this.store,
      this
    );
  }

  abstract getIdentifier(): string;

  abstract getRawEpisodeNumber(): number;

  async applyRules(): Promise<void> {
    const aniskipHttpClient = new AniskipHttpClient();
    const malId = await this.getMalId();

    // MAL id not found automatically.
    if (malId === 0) {
      return;
    }

    let rules = await BasePage.getCachedRules(malId);

    if (!rules) {
      ({ rules } = await aniskipHttpClient.getRules(malId));

      // Cache rules and expire it next week.
      const { rulesCache } = (await browser.storage.local.get({
        rulesCache: {},
      })) as LocalOptions;

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
        this.store.dispatch(malIdUpdated(toMalId));
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
    let malId = selectMalId(this.store.getState());

    // Episode redirection rules applied.
    if (malId > 0) {
      return malId;
    }

    // Search manually detected anime titles.
    const title = this.getTitle();

    if (!title) {
      return 0;
    }

    malId = this.store.dispatch(
      malIdUpdated(await BasePage.searchManualTitleToMalIdMapping(title))
    ).payload;

    if (malId > 0) {
      return malId;
    }

    // Search cache.
    const identifier = this.getIdentifier();

    if (!identifier) {
      return 0;
    }

    malId = this.store.dispatch(
      malIdUpdated(await BasePage.getCachedMalId(identifier))
    ).payload;

    if (malId > 0) {
      return malId;
    }

    // Query MALSync for MAL id.
    try {
      const malsyncHttpClient = new MalsyncHttpClient();
      const providerName = this.getProviderName();

      malId = this.store.dispatch(
        malIdUpdated(await malsyncHttpClient.getMalId(providerName, identifier))
      ).payload;
    } catch {
      // MALSync was not able to find the id.
      malId = this.store.dispatch(
        malIdUpdated(await BasePage.findClosestMalId(title))
      ).payload;

      // Titles found were not similar enough.
      if (malId === 0) {
        return 0;
      }
    }

    // Cache MAL id and expire it next week.
    const { malIdCache } = (await browser.storage.local.get({
      malIdCache: {},
    })) as LocalOptions;

    malIdCache[identifier] = {
      expires: getNextWeekDate().toJSON(),
      value: malId,
    };

    browser.storage.local.set({ malIdCache });

    return malId;
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

    const searchResponse = await anilistHttpClient.searchTitleSynonyms(
      sanitisedTitle
    );
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

    return 0;
  }

  /**
   * Returns a MAL id from the cache.
   *
   * @param identifier Provider anime identifier.
   */
  static async getCachedMalId(identifier: string): Promise<number> {
    const { malIdCache } = (await browser.storage.local.get({
      malIdCache: {},
    })) as LocalOptions;

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
    const { rulesCache } = (await browser.storage.local.get({
      rulesCache: {},
    })) as LocalOptions;

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

  injectOverlay(): void {
    document.body.appendChild(this.overlayRenderer.shadowRootContainer);

    this.overlayRenderer.render();
  }

  openOverlay(): void {
    this.store.dispatch(overlayOpened());
    this.overlayRenderer.render();
  }

  /**
   * Searches the manual title mapping for the MAL id with the most similar
   * title.
   */
  static async searchManualTitleToMalIdMapping(title: string): Promise<number> {
    const { manualTitleMalIdMap } = (await browser.storage.local.get({
      manualTitleMalIdMap: {},
    })) as LocalOptions;

    const titles = Object.keys(manualTitleMalIdMap);

    let closest = 0;
    let bestSimilarity = 0;

    titles.forEach((titleVariant) => {
      const similarity = stringSimilarity.compareTwoStrings(
        titleVariant.toLocaleLowerCase(),
        title.toLocaleLowerCase()
      );

      if (similarity >= bestSimilarity && manualTitleMalIdMap[title]) {
        bestSimilarity = similarity;
        closest = manualTitleMalIdMap[title]!;
      }
    });

    if (bestSimilarity > 0.6) {
      return closest;
    }

    return 0;
  }

  async storeManualTitleToMalIdMapping(malId: number): Promise<void> {
    const { manualTitleMalIdMap } = (await browser.storage.local.get({
      manualTitleMalIdMap: {},
    })) as LocalOptions;

    const title = this.getTitle();

    if (!title) {
      return;
    }

    manualTitleMalIdMap[title] = malId;

    browser.storage.local.set({ manualTitleMalIdMap });
  }
}
