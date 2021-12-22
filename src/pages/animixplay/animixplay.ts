import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class AniMixPlay extends BasePage {
  static getMetadata(): Metadata {
    return metadata;
  }

  getTitle(): string {
    const titleSpan = this.document.getElementsByClassName('animetitle')[0];
    if (titleSpan) {
      return titleSpan.innerHTML;
    }
    return this.getIdentifier();
  }

  getIdentifier(): string {
    return this.pathname.split('/')[2];
  }

  getRawEpisodeNumber(): number {
    const episodeNumberElement = this.document.getElementById('eptitleplace');

    const episodeNumberString = (episodeNumberElement?.textContent ?? '')
      .trim()
      .split('Episode ')[1];

    if (episodeNumberString) {
      return parseFloat(episodeNumberString);
    }

    return 1;
  }
}
