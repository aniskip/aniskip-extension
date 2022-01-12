import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class Crunchyroll extends BasePage {
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
    const episodeNumberElement = document.querySelector(
      '#showmedia_about_media > h4:not(#showmedia_about_episode_num)'
    );

    const episodeNumberString = (
      episodeNumberElement?.textContent ?? ''
    ).trim();

    return parseFloat(episodeNumberString.split('Episode ')[1]) || 1;
  }

  getTitle(): string {
    const pageMetadata = JSON.parse(
      document.querySelector('[type="application/ld+json"]')?.textContent ??
        '{}'
    );

    return pageMetadata.partOfSeason.name ?? '';
  }
}
