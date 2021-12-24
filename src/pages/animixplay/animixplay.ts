import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class AniMixPlay extends BasePage {
  constructor() {
    super();

    this.providerName = 'AniMixPlay';
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getTitle(): string {
    const titleSpan = document.getElementsByClassName('animetitle')[0];
    if (titleSpan) {
      return titleSpan.innerHTML;
    }
    return this.getIdentifier();
  }

  getIdentifier(): string {
    const identifierElement = document.getElementById('animebtn');

    return identifierElement?.getAttribute('href')?.split('/')[2] ?? '';
  }

  getRawEpisodeNumber(): number {
    const episodeNumberString = window.location.pathname.split('ep')[1];

    if (episodeNumberString) {
      return parseFloat(episodeNumberString);
    }

    return 1;
  }

  getMalId(): Promise<number> {
    // Redirection rules applied.
    if (this.malId > 0) {
      return Promise.resolve(this.malId);
    }

    this.malId = parseInt(this.getIdentifier(), 10);

    return Promise.resolve(this.malId);
  }
}
