import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class FourAnime extends BasePage {
  static getMetadata(): Metadata {
    return metadata;
  }

  getTitle(): string {
    const title = document.getElementById('titleleft')?.innerText;

    return title ?? '';
  }

  getIdentifier(): string {
    return window.location.pathname.replace('/', '').split('-episode')[0];
  }

  getRawEpisodeNumber(): number {
    const episodeNumberString = window.location.pathname.split('episode-')[1];

    if (episodeNumberString) {
      return parseFloat(episodeNumberString);
    }

    return 1;
  }
}
