import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class AnimeGo extends BasePage {
  static getMetadata(): Metadata {
    return metadata;
  }

  getIdentifier(): string {
    const title = this.getTitle();
    const encoded = encodeURIComponent(title.toLocaleLowerCase());
    const reEncoded = encodeURIComponent(encoded.replace(/\./g, '%2e'));
    return reEncoded;
  }

  getRawEpisodeNumber(): number {
    const episodeNumberString = document.querySelector(
      '.video-player__active'
    )?.textContent;

    return parseFloat(String(episodeNumberString)) || 1;
  }

  getTitle(): string {
    const title = document.querySelector('.list-unstyled.small.mb-0')
      ?.firstChild?.textContent;

    return title ?? '';
  }
}
