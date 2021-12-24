import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class FourAnime extends BasePage {
  static getMetadata(): Metadata {
    return metadata;
  }

  getTitle(): string {
    const title = this.document.getElementById('titleleft')?.innerText;

    return title ?? '';
  }

  getIdentifier(): string {
    return this.pathname.replace('/', '').split('-episode')[0];
  }

  getRawEpisodeNumber(): number {
    const episodeNumberString = this.pathname.split('episode-')[1];

    if (episodeNumberString) {
      return parseFloat(episodeNumberString);
    }

    return 1;
  }
}
