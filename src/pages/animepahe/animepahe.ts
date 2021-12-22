import { getDomainName } from '../../utils';
import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class Animepahe extends BasePage {
  constructor(hostname: string, pathname: string, document: Document) {
    super(hostname, pathname, document);
    const domainName = getDomainName(hostname);
    this.providerName = domainName;
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getTitle(): string {
    const titleElement = this.document.getElementsByTagName('title')[0];
    if (!titleElement) {
      return '';
    }

    return titleElement.innerText.split(' Ep')[0];
  }

  getIdentifier(): string {
    const [identifierScript] = Array.from(
      this.document.getElementsByTagName('script')
    ).filter((script) => script.innerHTML.includes('getUrls'));

    if (!identifierScript) {
      return '';
    }

    const matches = identifierScript.innerHTML.match(/getUrls\((\d+)/);

    if (!matches) {
      return '';
    }

    return matches[1];
  }

  getRawEpisodeNumber(): number {
    const episodeMenuButton = this.document.getElementById('episodeMenu');

    if (!episodeMenuButton) {
      return 0;
    }

    const episodeNumberString =
      episodeMenuButton.innerText.split('Episode ')[1];

    return parseFloat(episodeNumberString);
  }
}
