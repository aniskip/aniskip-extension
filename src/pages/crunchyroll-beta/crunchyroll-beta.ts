import { CrunchyrollBetaHttpClient } from '../../api';
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

    new MutationObserver(async () => {
      if (this.previousPath === window.location.pathname) {
        return;
      }

      this.previousPath = window.location.pathname;

      const identifier = this.getIdentifier();

      const response =
        await this.crunchyrollBetaHttpClient.getEpisodeInformation(identifier);

      const episodeMetadata = response.items[0].episode_metadata;

      this.rawEpisodeNumber = episodeMetadata.episode_number;
      this.title = episodeMetadata.season_title;
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
