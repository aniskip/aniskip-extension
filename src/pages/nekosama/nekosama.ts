import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class NekoSama extends BasePage {
  constructor() {
    super();

    this.providerName = 'NekoSama';
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getTitle(): string {
    const title = document.querySelector(
      'div.row.no-gutters.anime-info > div.info > div > div > h1'
    )?.textContent;

    return title ?? '';
  }

  getIdentifier(): string {
    return window.location.pathname.split('/')[3].split('-')[0];
  }

  getRawEpisodeNumber(): number {
    const episodeNumberStringElement = document.querySelector(
      'div.row.no-gutters.anime-info > div.info > div > div > h2'
    );

    const episodeNumberString = (episodeNumberStringElement?.textContent ?? '')
      .trim()
      .split('Episode ')[1];

    if (episodeNumberString) {
      return parseFloat(episodeNumberString);
    }

    return 0;
  }
}
