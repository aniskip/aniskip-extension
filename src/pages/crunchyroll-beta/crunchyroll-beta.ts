import { CrunchyrollBetaHttpClient } from '../../api';
import { pageStateReset } from '../../data';
import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class CrunchyrollBeta extends BasePage {
  rawEpisodeNumber: number;

  title: string;

  crunchyrollBetaHttpClient: CrunchyrollBetaHttpClient;

  previousPath: string;

  constructor() {
    super();

    this.providerName = 'BetaCrunchyroll';
    this.rawEpisodeNumber = 1;
    this.title = '';
    this.crunchyrollBetaHttpClient = new CrunchyrollBetaHttpClient();
    this.previousPath = '';

    // SPA detection for series and episodes.
    new MutationObserver(async () => {
      if (this.previousPath === window.location.pathname) {
        return;
      }

      this.previousPath = window.location.pathname;

      const identifier = this.getIdentifier();

      if (!identifier) {
        return;
      }

      const response =
        await this.crunchyrollBetaHttpClient.getEpisodeInformation(identifier);

      // Not in an episode page.
      if (response.items.length === 0 || response.items[0].type !== 'episode') {
        return;
      }

      const episodeMetadata = response.items[0].episode_metadata;

      this.rawEpisodeNumber = episodeMetadata.episode_number;
      this.title = episodeMetadata.season_title;

      this.store.dispatch(pageStateReset());
    }).observe(document, { subtree: true, childList: true });
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getIdentifier(): string {
    return window.location.pathname.split('/')[2];
  }

  getRawEpisodeNumber(): number {
    return this.rawEpisodeNumber;
  }

  getTitle(): string {
    return this.title;
  }
}
