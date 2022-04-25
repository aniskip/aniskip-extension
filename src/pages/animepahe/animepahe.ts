import { getDomainName } from '../../utils';
import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class Animepahe extends BasePage {
  constructor() {
    super();

    const domainName = getDomainName(window.location.hostname);
    this.providerName = domainName;
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getTitle(): string {
    const titleElement = document.getElementsByTagName('title')[0];
    if (!titleElement) {
      return '';
    }

    return titleElement.innerText.split(' Ep')[0];
  }

  getIdentifier(): string {
    const meta: HTMLMetaElement | null = document.querySelector('meta[name=id]');

    if (!meta) {
      return '';
    }
    
    return meta.content;
  }

  getRawEpisodeNumber(): number {
    const episodeMenuButton = document.getElementById('episodeMenu');

    if (!episodeMenuButton) {
      return 0;
    }

    const episodeNumberString =
      episodeMenuButton.innerText.split('Episode ')[1];

    return parseFloat(episodeNumberString);
  }
}
